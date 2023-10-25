package task

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type RecurrenceType string

const (
	RecurrenceNone   RecurrenceType = "none"
	RecurrenceDaily  RecurrenceType = "daily"
	RecurrenceWeekly RecurrenceType = "weekly"
)

type Task struct {
	ID         primitive.ObjectID   `json:"id, omitempty" bson:"_id"`
	Title      string               `json:"title,omitempty" bson:"title,omitempty"`
	Categories []primitive.ObjectID `json:"categories" bson:"categories"`
	Completed  bool                 `json:"completed,omitempty" bson:"completed,omitempty"`
	Recurrence RecurrenceType       `json:"recurrence,omitempty" bson:"recurrence,omitempty"`
	IsPublic   bool                 `json:"isPublic" bson:"isPublic"`
	CreatedBy  primitive.ObjectID   `json:"created_by, omitempty" bson:"created_by"`
	CreatedAt  time.Time            `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}
