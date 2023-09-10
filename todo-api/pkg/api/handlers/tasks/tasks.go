package tasks

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	tasksmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/tasks"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var jwtSecret = []byte("YOUR_JWT_SECRET")

func CreateTaskHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	log.Println("Received request: POST /tasks/create")

	w.Header().Set("Content-Type", "application/json")

	var task tasksmodels.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	// ===========================================================================
	// TOKEN

	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		http.Error(w, "Missing or invalid Authorization header", http.StatusUnauthorized)
		return
	}
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		http.Error(w, "invalid Authorization header", http.StatusUnauthorized)
		return
	}
	tokenStr := parts[1]
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		http.Error(w, fmt.Sprintf("error parsing token: %v", err), http.StatusBadRequest)
		return
	}
	if !token.Valid {
		http.Error(w, fmt.Sprintln("error: Invalid Token"), http.StatusBadRequest)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		if userIDStr, ok := claims["user_id"].(string); ok {
			userID, err := primitive.ObjectIDFromHex(userIDStr)
			if err != nil {
				http.Error(w, fmt.Sprintf("Error Invalid token claims: %v", err), http.StatusBadRequest)
				return
			}
			task.CreatedBy = userID
		}
	} else {
		http.Error(w, fmt.Sprintf("Error Invalid token claims"), http.StatusBadRequest)
		return
	}

	// ===========================================================================

	task.ID = primitive.NewObjectID()
	task.CreatedAt = time.Now()
	task.Completed = false
	task.Categories = []primitive.ObjectID{}

	err = AddTask(col, task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting task: %v", err), http.StatusInternalServerError)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func GetTasksHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {
	log.Println("Received request: GET /tasks")

	w.Header().Set("Content-Type", "application/json")

	tasks := GetTasks(col)
	// if err != nil {
	// 	http.Error(w, fmt.Sprintf("Error getting tasks: %v", err), http.StatusInternalServerError)
	// }

	responseB, err := json.Marshal(tasks)
	if err != nil {
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(responseB)

}

func UpdateTaskStatusHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	w.Header().Set("Content-Type", "application/json")

	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: PATCH /tasks/{%v}/complete\n", id)

	_, err = col.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"completed": true}},
		// bson.M{"$set": bson.M{"completed": updateData.Completed}},
	)
	if err != nil {
		log.Printf("Error updating task: %v\n", err)
		http.Error(w, fmt.Sprintf("Error updating task: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	w.Header().Set("Content-Type", "application/json")
	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: DELETE /tasks/{%v}\n", id)

	result, err := col.DeleteOne(
		context.Background(),
		bson.M{"_id": id},
	)
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("DeleteOne removed %v document(s)\n", result.DeletedCount)

	w.WriteHeader(http.StatusOK)
}

func GetIDFromURL(r *http.Request) (primitive.ObjectID, error) {
	vars := mux.Vars(r)
	taskID := vars["id"]
	return primitive.ObjectIDFromHex(taskID)
}

func UpdateTaskCategoriesHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	w.Header().Set("Content-Type", "application/json")

	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: PATCH /tasks/{%v}/categories\n", id)

	var updateCategories struct {
		Categories []primitive.ObjectID `json:"categories"`
	}

	err = json.NewDecoder(r.Body).Decode(&updateCategories)
	if err != nil {
		log.Fatal(err)
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("categories %v\n", updateCategories)

	_, err = col.UpdateOne(context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"categories": updateCategories.Categories}},
	)
	if err != nil {
		log.Fatal(err)
		http.Error(w, fmt.Sprintf("Error updating task categories: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updateCategories)
}

func UpdateTaskHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {
	log.Println("Received request: PUT /tasks/update")

	w.Header().Set("Content-Type", "application/json")

	// Extract task ID from URL parameters (assuming you're using a library like gorilla/mux)
	vars := mux.Vars(r)
	taskID, err := primitive.ObjectIDFromHex(vars["id"])
	if err != nil {
		http.Error(w, fmt.Sprintf("Invalid task ID: %v", err), http.StatusBadRequest)
		return
	}

	// Decode the updated task fields/values from the request body
	var updates tasksmodels.Task
	err = json.NewDecoder(r.Body).Decode(&updates)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	log.Printf("updates %v\n", updates)

	// Create a filter to match the task by ID
	filter := bson.M{"_id": taskID}

	// Prepare the update parameters (use $set to specify fields to update)
	update := bson.M{
		"$set": updates,
	}

	// Execute the update
	result, err := col.UpdateOne(context.Background(), filter, update)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error updating task: %v", err), http.StatusInternalServerError)
		return
	}

	if result.ModifiedCount == 0 {
		http.Error(w, "No tasks were updated", http.StatusNotFound)
		return
	}

	// Optionally, return the updated task to the client
	var updatedTask tasksmodels.Task
	err = col.FindOne(context.Background(), filter).Decode(&updatedTask)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching updated task: %v", err), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(updatedTask)
}
