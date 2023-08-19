package categories

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	categoriesmodel "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/categories"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetIDFromURL(r *http.Request) (primitive.ObjectID, error) {
	vars := mux.Vars(r)
	taskID := vars["id"]
	return primitive.ObjectIDFromHex(taskID)
}

func CreateCategoryHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	log.Println("Received request: POST /categories/create")

	w.Header().Set("Content-Type", "application/json")

	var category categoriesmodel.Category
	err := json.NewDecoder(r.Body).Decode(&category)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	category.ID = primitive.NewObjectID()
	category.CreatedAt = time.Now()

	_, err = col.InsertOne(context.Background(), category)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting category: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(category)
}

func GetCategoriesHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {
	log.Println("Received request: GET /categories")

	w.Header().Set("Content-Type", "application/json")

	filter := bson.D{}
	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}
	// end find

	var results []categoriesmodel.Category
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var categories []categoriesmodel.Category
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

func DeleteCategoryHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	w.Header().Set("Content-Type", "application/json")
	id, err := GetIDFromURL(r)
	if err != nil {
		log.Fatal(err)
	}

	log.Printf("Received request: DELETE /categories/{%v}\n", id)

	result, err := col.DeleteOne(
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
