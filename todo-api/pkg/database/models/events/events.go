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
	ID        primitive.ObjectID
	TaskID    primitive.ObjectID
	CreatedBy primitive.ObjectID
	CreatedAt time.Time
	Type      EventType
}
