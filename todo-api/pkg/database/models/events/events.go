package events

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EventType string

const (
	EventStarted    EventType = "STARTED"
	EventInProgress EventType = "INPROGRESS"
	EventPaused     EventType = "PAUSED"
	EventCompleted  EventType = "COMPLETED"
)

type Event struct {
	ID        primitive.ObjectID `json:"id"" bson:"_id"`
	TaskID    primitive.ObjectID `json:"taskID" bson:"taskID"`
	CreatedBy primitive.ObjectID `json:"createdBy" bson:"createdBy"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	Type      EventType          `json:"type" bson:"type"`
}
