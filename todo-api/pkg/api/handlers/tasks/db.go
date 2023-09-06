package tasks

import (
	"context"

	tasksmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/tasks"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddTask(col *mongo.Collection, task tasksmodels.Task) error {
	_, err := col.InsertOne(context.Background(), task)
	return err
}

func GetTasks(col *mongo.Collection) []tasksmodels.Task {
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
		if result.Categories == nil {
			result.Categories = []primitive.ObjectID{}
		}
		tasks = append(tasks, result)
	}

	return tasks
}
