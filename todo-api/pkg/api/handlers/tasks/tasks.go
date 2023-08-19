package tasks

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	tasksmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/tasks"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTaskHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	log.Println("Received request: POST /tasks/create")

	w.Header().Set("Content-Type", "application/json")

	var task tasksmodels.Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	task.ID = primitive.NewObjectID()
	task.CreatedAt = time.Now()
	task.Completed = false // Set default value

	_, err = col.InsertOne(context.Background(), task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting task: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func GetTasksHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {
	log.Println("Received request: GET /tasks")

	w.Header().Set("Content-Type", "application/json")

	filter := bson.D{}
	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	var results []tasksmodels.Task
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var tasks []tasksmodels.Task
	for _, result := range results {
		cursor.Decode(&result)
		// output, err := json.MarshalIndent(result, "", "    ")
		// if err != nil {
		// 	panic(err)
		// }
		if result.Categories == nil {
			result.Categories = []primitive.ObjectID{}
		}
		tasks = append(tasks, result)
	}

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

	// var updateData struct {
	// 	Completed bool `json:"completed"`
	// }

	// err := json.NewDecoder(r.Body).Decode(&updateData)
	// if err != nil {
	// 	log.Println(fmt.Sprintf("Error decoding request body: %v", err))
	// 	http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
	// 	return
	// }

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
	fmt.Printf("DeleteOne removed %v document(s)\n", result.DeletedCount)

	// result, err := tasksCollection.DeleteOne(context.Background(), bson.M{"_id": taskID})
	// if err != nil {
	// 	log.Println(fmt.Sprintf("Error deleting task: %v", err))
	// 	http.Error(w, fmt.Sprintf("Error deleting task: %v", err), http.StatusInternalServerError)
	// 	return
	// }

	// log.Println("deleted", result.DeletedCount)
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
