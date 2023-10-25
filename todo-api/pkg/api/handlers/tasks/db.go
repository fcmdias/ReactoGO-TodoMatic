package tasks

import (
	"context"
	"log"
	"time"

	eventsmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/events"
	tasksmodels "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/tasks"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

func GetTasks(col, eventsCollection *mongo.Collection) []TaskWithCreator {

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

	// =======================================================================
	// Fetch events for the tasks

	eventsMap := make(map[primitive.ObjectID][]eventsmodels.Event)

	for _, task := range tasks {
		var filter bson.M

		switch task.Recurrence {
		case tasksmodels.RecurrenceDaily:
			filter = bson.M{"taskID": task.ID, "createdAt": bson.M{"$gte": time.Now().Truncate(24 * time.Hour)}}
		case tasksmodels.RecurrenceWeekly:
			weekAgo := time.Now().AddDate(0, 0, -7)
			filter = bson.M{"taskID": task.ID, "createdAt": bson.M{"$gte": weekAgo}}
		default:
			filter = bson.M{"taskID": task.ID}
		}

		var events []eventsmodels.Event
		cursor, err := eventsCollection.Find(ctx, filter)
		if err != nil {
			log.Println(err)
			continue
		}

		for cursor.Next(ctx) {
			var event eventsmodels.Event
			if err := cursor.Decode(&event); err != nil {
				log.Println(err)
				continue
			}
			events = append(events, event)
		}

		cursor.Close(ctx)

		eventsMap[task.ID] = events
	}

	log.Println("events map: ", eventsMap)
	var response []TaskWithCreator

	for _, task := range tasks {
		if v, ok := eventsMap[task.ID]; ok {
			if len(v) > 0 {
				continue
			}
		}
		response = append(response, task)
	}

	return response
}

func TaskWithCreatorToTask(t TaskWithCreator) tasksmodels.Task {
	return tasksmodels.Task{
		ID:         t.ID,
		CreatedBy:  t.CreatedBy,
		Recurrence: t.Recurrence,
		Title:      t.Title,
		IsPublic:   t.IsPublic,
		Categories: t.Categories,
		Completed:  t.Completed,
		CreatedAt:  t.CreatedAt,
	}
}
