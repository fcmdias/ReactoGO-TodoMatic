up: 
	docker-compose up

reset: 
	docker-compose down
	docker-compose up --build

rebuild-react:
	docker-compose build react-app
	docker-compose up -d react-app

rebuild-todo:
	docker-compose build todo-api
	docker-compose up -d todo-api

rebuild-users:
	docker-compose build users-api
	docker-compose up -d users-api