up: 
	docker-compose up

reset: 
	docker-compose down
	docker-compose up --build

rebuild-react:
	docker-compose build react-app
	docker-compose up -d react-app