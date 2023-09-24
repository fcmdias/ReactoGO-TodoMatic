package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	categorieshandler "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/api/handlers/categories"
	eventshandler "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/api/handlers/events"
	taskshandler "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/api/handlers/tasks"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var tasksCollection *mongo.Collection
var categoriesCollection *mongo.Collection
var eventsCollection *mongo.Collection

var mongoURI = ""

var version = "0.0.2"

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
	eventsCollection = db.Collection("events")
}

func main() {
	log.Println("version:", version)
	router := mux.NewRouter()

	// ================================================================================
	// Tasks handlers.

	router.HandleFunc("/tasks/create", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.CreateTaskHandler(w, r, tasksCollection)
	}).Methods("POST")
	router.HandleFunc("/tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.UpdateTaskHandler(w, r, tasksCollection)
	}).Methods("PUT")
	router.HandleFunc("/tasks/{id}/complete", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.UpdateTaskStatusHandler(w, r, tasksCollection)
	}).Methods("PATCH")
	router.HandleFunc("/tasks/{id}/categories", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.UpdateTaskCategoriesHandler(w, r, tasksCollection)
	}).Methods("PATCH")
	router.HandleFunc("/tasks/{id}", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.DeleteTaskHandler(w, r, tasksCollection)
	}).Methods("DELETE")
	router.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		taskshandler.GetTasksHandler(w, r, tasksCollection)
	}).Methods("GET")

	// ================================================================================
	// Categories handlers.

	router.HandleFunc("/categories/create", func(w http.ResponseWriter, r *http.Request) {
		categorieshandler.CreateCategoryHandler(w, r, categoriesCollection)
	}).Methods("POST")
	router.HandleFunc("/categories/{id}", func(w http.ResponseWriter, r *http.Request) {
		categorieshandler.DeleteCategoryHandler(w, r, categoriesCollection)
	}).Methods("DELETE")
	router.HandleFunc("/categories", func(w http.ResponseWriter, r *http.Request) {
		categorieshandler.GetCategoriesHandler(w, r, categoriesCollection)
	}).Methods("GET")

	// ================================================================================
	// Events handlers.

	router.HandleFunc("/events/create", func(w http.ResponseWriter, r *http.Request) {
		eventshandler.CreateEventHandler(w, r, eventsCollection)
	}).Methods("POST")

	// router.HandleFunc("/categories/{id}", func(w http.ResponseWriter, r *http.Request) {
	// 	categorieshandler.DeleteCategoryHandler(w, r, categoriesCollection)
	// }).Methods("DELETE")
	router.HandleFunc("/events", func(w http.ResponseWriter, r *http.Request) {
		eventshandler.GetEventsHandler(w, r, eventsCollection)
	}).Methods("GET")

	// ================================================================================
	// Service starting.

	port := "8080"
	log.Printf("Server listening on port %s\n", port)
	err := http.ListenAndServe(":"+port, router)
	if err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
