DEV_COMPOSE_FILE := docker-compose.dev.yml
PROD_COMPOSE_FILE := docker-compose.prod.yml
ALL_COMPOSE_FILE := $(wildcard *.yml)
ALL_IMAGES_ID := $(shell docker images -a | grep -v neo4j | awk '{print $3}' | tail -n +2)


dev:
	docker compose -f $(DEV_COMPOSE_FILE) up --build

prod:
	docker compose -f $(PROD_COMPOSE_FILE) up --build

down:
	@$(foreach file,$(ALL_COMPOSE_FILE), \
		echo "Stopping containers in $(file)..." && \
		docker-compose -f $(file) --verbose down; \
	)

clean: down
	docker container prune -f
	docker rmi -f $(ALL_IMAGES_ID)

dev-re: clean dev

prod-re: clean prod
