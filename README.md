# api-template

### This is a project to be used as a template to create new APIs or microservices for SROA projects

## Installation

```sh
nvm install lts/fermium
nvm use lts/fermium
npm i --legacy-peer-deps
```
## How to use (Basic)

- Clone the project
- Make a copy of `.env.default` and name it: `.env`
- Put a valid value to `MONGO_URI` variable
- Run `npm ci`
- Run `npm start`

> Requirements

- NodeJS (v14 preferred)
- An accesible MongoDB database

## Local Development with Docker

Change the environment to:
```sh
MONGO_URI=mongodb://mongodb:27017
```
And run the following command:

```sh
docker-compose up -d
docker exec -it api-container bash
yarn
yarn start
```

## Architectural Decisions
 - The initial project template was put in the src/main.v1 directory
 - The main.v2 directory represents a sugestion of new code architecture
 - It respect the dependecy inversion principle, along side with other SOLID principles
 - The code architecture was based on Clean Architecture
 - It as a layerd architecure
 - There is separation of concerns between business logic and implementation logic
   - The domain layer has most of the business rules
   - The infra layer access the data, contains repository implementations
   - The presentation layer access the has the web interface that will be used by Http API, contains the controllers, middlewares, http erros.
 - Advantages:
   - Losse coupled components
   - Enables multiple agents contibuting to the project at same time
   - Enhance the speed of development of a larger platform
   - Its easier to upgrade or chagne technologies over time
   - Has plenty of academic and techical posts about this popular architecture
 - Disadvantages:
   - Maybe is harder to understand and first (low curve of learning)
   - Add eventual complexity that maybe unecessary for scope of the project
   - It may go against YAGNI, if not well handled
 - Dependency Rule:
   - Domain layer is the core of the system
     - All the other layers depend on it
   - Data layer
     - Depends only on the domain layer
   - Presentation
     - depends on the domain layer
   - Infra
     - Depends on data and domain layers
   - Main depends on the rest of then and wrap the things together to create the application

## References
 - [Clean Architecture, book by Robert C. Martin](https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/)
 - [Clean Architecture, blog cleancoder by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
 - [Organizing App Logic with the Clean Architecture, by Khalil Stemmler](https://khalilstemmler.com/articles/software-design-architecture/organizing-app-logic/)
 - [Clean Architecure Course, by Rodrigo Manguinho](https://www.udemy.com/course/tdd-com-mango/)
 - [Clean Architecture Guide, by Mario Sanoguera de Lorenzo](https://proandroiddev.com/clean-architecture-data-flow-dependency-rule-615ffdd79e29)
