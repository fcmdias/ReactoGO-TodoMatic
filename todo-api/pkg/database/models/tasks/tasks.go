package task

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Task struct {
	ID         primitive.ObjectID   `json:"id, omitempty" bson:"_id"`
	Title      string               `json:"title,omitempty" bson:"title,omitempty"`
	Categories []primitive.ObjectID `json:"categories" bson:"categories"`
	Completed  bool                 `json:"completed,omitempty" bson:"completed,omitempty"`
	CreatedAt  time.Time            `json:"createdAt,omitempty" bson:"createdAt,omitempty"`
}
