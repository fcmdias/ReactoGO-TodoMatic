package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       string `bson:"_id,omitempty"`
	Username string `bson:"username" validate:"required"`
	Password string `bson:"password" validate:"required"`
	Email    string `bson:"email" validate:"required,email"`
}

var usersCollection *mongo.Collection
var mongoURI = ""

// JWT Secret, it's better to store this in an environment variable
var jwtSecret = []byte("YOUR_JWT_SECRET")

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
	usersCollection = db.Collection("users")

}

func Register(c *gin.Context) {
	// Bind the JSON body of the request to a User struct
	var user User
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to bind request"})
		return
	}

	validate := validator.New()
	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists based on username or email
	var result User
	err := usersCollection.FindOne(context.TODO(), bson.M{
		"$or": []bson.M{
			{"username": user.Username},
			{"email": user.Email},
		},
	}).Decode(&result)
	if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	// Hash the user's password
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)

	// Insert the user into the database
	_, err = usersCollection.InsertOne(context.TODO(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to register user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully registered"})
}

func GetAllUsers(c *gin.Context) {
	var users []User

	cursor, err := usersCollection.Find(context.TODO(), bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		var user User
		cursor.Decode(&user)
		user.Password = ""
		users = append(users, user)
	}

	if err := cursor.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cursor error"})
		return
	}

	c.JSON(http.StatusOK, users)
}

func Login(c *gin.Context) {
	var loginVals struct {
		Username string `json:"username" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// Bind the JSON body of the request to the loginVals struct
	if err := c.BindJSON(&loginVals); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please provide a valid username and password"})
		return
	}

	// Retrieve the user based on the provided username
	var user User
	err := usersCollection.FindOne(context.TODO(), bson.M{
		"username": loginVals.Username,
	}).Decode(&user)

	// Check for errors (e.g., user not found)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect credentials"})
		return
	}

	// Compare the hashed password in the DB with the provided password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginVals.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect credentials"})
		return
	}

	// ====================================================================================
	// Generating token

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":  user.ID,
		"username": user.Username,
		"exp":      time.Now().Add(time.Hour * 72).Unix(), // Token expiration
	})

	tokenStr, err := token.SignedString(jwtSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	// ====================================================================================

	c.JSON(http.StatusOK, gin.H{"token": tokenStr})
}

func main() {
	r := gin.Default()
	r.POST("/register", Register)
	r.POST("/login", Login)
	r.GET("/users", GetAllUsers)
	r.Run()
}
