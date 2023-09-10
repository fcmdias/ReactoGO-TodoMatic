package tasks

import (
	"context"
	"fmt"
	"time"

	tasksmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/tasks"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

func AddTask(col *mongo.Collection, task tasksmodels.Task) error {
	_, err := col.InsertOne(context.Background(), task)
	return err
}

type TaskWithCreator struct {
	tasksmodels.Task `bson:",inline"`
	Creator          struct {
		Username string `bson:"username"`
	} `bson:"creator"`
}

func GetTasks(col *mongo.Collection) []TaskWithCreator {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Aggregation pipeline to fetch tasks with their creators
	pipeline := mongo.Pipeline{
		{{"$lookup", bson.D{
			{"from", "users"},
			{"localField", "created_by"},
			{"foreignField", "_id"},
			{"as", "creator"},
		}}},
		{{"$unwind", "$creator"}},
	}

	cursor, err := col.Aggregate(ctx, pipeline)
	if err != nil {
		panic(err)
	}
	defer cursor.Close(ctx)

	var tasks []TaskWithCreator

	if err = cursor.All(ctx, &tasks); err != nil {
		panic(err)
	}

	fmt.Println(tasks)

	return tasks
}

func TaskWithCreatorToTask(t TaskWithCreator) tasksmodels.Task {
	return tasksmodels.Task{
		ID:         t.ID,
		CreatedBy:  t.CreatedBy,
		Title:      t.Title,
		Categories: t.Categories,
		Completed:  t.Completed,
		CreatedAt:  t.CreatedAt,
	}
}
