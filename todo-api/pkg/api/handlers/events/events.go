package events

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	eventsmodel "github.com/fcmdias/ReactoGO-TodoMatic/todo-api/pkg/database/models/events"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var jwtSecret = []byte("YOUR_JWT_SECRET")

func GetEventsHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {
	log.Println("Received request: GET /events")

	w.Header().Set("Content-Type", "application/json")

	events := GetEvents(col)

	responseB, err := json.Marshal(events)
	if err != nil {
		log.Println(err)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(responseB)

}

func CreateEventHandler(w http.ResponseWriter, r *http.Request, col *mongo.Collection) {

	log.Println("Received request: POST /events/create")

	w.Header().Set("Content-Type", "application/json")

	var event eventsmodel.Event
	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	// ================================================================
	// Get User Credentials from TOKEN

	user, err := getUser(r)
	if err != nil {
		http.Error(w, fmt.Sprintf("not able to get user from token: %v", err), http.StatusInternalServerError)
	}

	// ================================================================

	event.ID = primitive.NewObjectID()
	event.CreatedAt = time.Now()
	event.CreatedBy = user.ID

	_, err = col.InsertOne(context.Background(), event)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error inserting event: %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(event)
}

func getUser(r *http.Request) (user User, err error) {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return User{}, fmt.Errorf("missing or invalid Authorization header")
	}
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return User{}, fmt.Errorf("invalid Authorization header")
	}
	tokenStr := parts[1]
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("uexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return User{}, fmt.Errorf("error parsing token: %v", err)
	}
	if !token.Valid {
		return User{}, fmt.Errorf("invalid Token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		if userIDStr, ok := claims["user_id"].(string); ok {
			userID, err := primitive.ObjectIDFromHex(userIDStr)
			if err != nil {
				return User{}, fmt.Errorf("invalid token claims: %v", err)
			}
			user.ID = userID
		}
		if username, ok := claims["username"].(string); ok {
			user.Username = username
		}
	} else {

		return User{}, fmt.Errorf("invalid token claims")
	}

	return user, nil
}

type User struct {
	Username string
	ID       primitive.ObjectID
}

func GetEvents(col *mongo.Collection) []eventsmodel.Event {
	filter := bson.D{}
	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	var results []eventsmodel.Event
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var events []eventsmodel.Event
	for _, result := range results {
		cursor.Decode(&result)
		events = append(events, result)
	}

	return events
}
