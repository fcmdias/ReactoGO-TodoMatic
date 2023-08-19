package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var tasksCollection *mongo.Collection
var categoriesCollection *mongo.Collection

var mongoURI = ""

var version = "0.0.2"

type Category struct {
	ID        primitive.ObjectID `json:"id, omitempty" bson:"_id"`
	Title     string             `json:"title,omitempty" bson:"title,omitempty"`
	CreatedAt time.Time          `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}

type Task struct {
	ID         primitive.ObjectID   `json:"id, omitempty" bson:"_id"`
	Title      string               `json:"title,omitempty" bson:"title,omitempty"`
	Categories []primitive.ObjectID `json:"categories" bson:"categories"`
	Completed  bool                 `json:"completed,omitempty" bson:"completed,omitempty"`
	CreatedAt  time.Time            `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}

func init() {
	mongoURI = os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable not set")
	}

	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to Database.")

	db := client.Database("todo_db")
	tasksCollection = db.Collection("tasks")
	categoriesCollection = db.Collection("categories")
}

func createTaskHandler(w http.ResponseWriter, r *http.Request) {

	log.Println("Received request: POST /tasks/create")

	w.Header().Set("Content-Type", "application/json")

	var task Task
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	task.ID = primitive.NewObjectID()
	task.CreatedAt = time.Now()
	task.Completed = false // Set default value

	_, err = tasksCollection.InsertOne(context.Background(), task)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting task: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func getTasksHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request: GET /tasks")

	w.Header().Set("Content-Type", "application/json")

	filter := bson.D{}
	cursor, err := tasksCollection.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	var results []Task
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var tasks []Task
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

func updateTaskStatusHandler(w http.ResponseWriter, r *http.Request) {

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

	_, err = tasksCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"completed": true}},
		// bson.M{"$set": bson.M{"completed": updateData.Completed}},
	)
	if err != nil {
		log.Println(fmt.Sprintf("Error updating task: %v", err))
		http.Error(w, fmt.Sprintf("Error updating task: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func deleteTaskHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: DELETE /tasks/{%v}\n", id)

	result, err := tasksCollection.DeleteOne(
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

func createCategoryHandler(w http.ResponseWriter, r *http.Request) {

	log.Println("Received request: POST /categories/create")

	w.Header().Set("Content-Type", "application/json")

	var category Category
	err := json.NewDecoder(r.Body).Decode(&category)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	category.ID = primitive.NewObjectID()
	category.CreatedAt = time.Now()

	_, err = categoriesCollection.InsertOne(context.Background(), category)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting category: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(category)
}

func getCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	log.Println("Received request: GET /categories")

	w.Header().Set("Content-Type", "application/json")

	filter := bson.D{}
	cursor, err := categoriesCollection.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
	// end find

	var results []Category
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var categories []Category
	for _, result := range results {
		cursor.Decode(&result)
		// output, err := json.MarshalIndent(result, "", "    ")
		// if err != nil {
		// 	panic(err)
		// }
		categories = append(categories, result)
	}

	// // Manually marshal the categories slice into JSON
	responseData, err := json.Marshal(categories)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error encoding categories to JSON: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(responseData)
}

func deleteCategoryHandler(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")
	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: DELETE /categories/{%v}\n", id)

	result, err := categoriesCollection.DeleteOne(
		context.Background(),
		bson.M{"_id": id},
	)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("DeleteOne removed %v document(s)\n", result.DeletedCount)

	// result, err := categoriesCollection.DeleteOne(context.Background(), bson.M{"_id": categoryID})
	// if err != nil {
	// 	log.Println(fmt.Sprintf("Error deleting category: %v", err))
	// 	http.Error(w, fmt.Sprintf("Error deleting category: %v", err), http.StatusInternalServerError)
	// 	return
	// }

	// log.Println("deleted", result.DeletedCount)
	w.WriteHeader(http.StatusOK)
}

func updateTaskCategoriesHandler(w http.ResponseWriter, r *http.Request) {

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

	_, err = tasksCollection.UpdateOne(context.Background(),
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

func GetIDFromURL(r *http.Request) (primitive.ObjectID, error) {
	vars := mux.Vars(r)
	taskID := vars["id"]
	return primitive.ObjectIDFromHex(taskID)
}

func main() {
	log.Println("version:", version)
	router := mux.NewRouter()
	router.HandleFunc("/tasks/create", createTaskHandler).Methods("POST")
	router.HandleFunc("/tasks/{id}/complete", updateTaskStatusHandler).Methods("PATCH")
	router.HandleFunc("/tasks/{id}/categories", updateTaskCategoriesHandler).Methods("PATCH")
	router.HandleFunc("/tasks/{id}", deleteTaskHandler).Methods("DELETE")
	router.HandleFunc("/tasks", getTasksHandler).Methods("GET")

	router.HandleFunc("/categories/create", createCategoryHandler).Methods("POST")
	router.HandleFunc("/categories/{id}", deleteCategoryHandler).Methods("DELETE")
	router.HandleFunc("/categories", getCategoriesHandler).Methods("GET")

	port := "8080"
	log.Printf("Server listening on port %s\n", port)
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
