all:
	@mkdir -p ./srcs/requirements/backend/postgresql/DB
	@docker-compose -f ./srcs/docker-compose.yml up

clean:
	-@docker-compose -f ./srcs/docker-compose.yml down

fclean : clean
	-@docker system prune -f
	-@docker rmi $$(docker images -q)
	-@rm -rf ./srcs/requirements/backend/postgresql/DB


re: clean all

.PHONY : check-env all clean fclean rm-volumes re bonus
