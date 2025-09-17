# Fragments Microservice

## Overview
The **Fragments Microservice** is a cloud-native application built using Node.js, Express, and AWS cloud services, designed to allow authenticated users to create, store, manage, and convert data fragments (text, JSON, Markdown, images). It follows modern software engineering practices including microservices, containerization, CI/CD automation, and cloud deployment.

## Key Features
- **Secure API Development**
	- Implemented RESTful API with Express.js, Passport.js, and AWS Cognito authentication.
	- Applied structured logging with Pino, dotenv for configuration, and environment-based setups.
- **Data Persistence**
	- Started with In-Memory DB, then migrated to AWS DynamoDB (metadata) and AWS S3 (fragment data).
	- Enabled support for multiple fragment types: text/*, application/json, and images with type conversions.
- **Testing & Quality Assurance**
	- Built unit tests with Jest & Supertest for API validation.
	- Added integration tests with Hurl + Docker Compose for end-to-end scenarios.
	- Maintained 85%+ coverage across all releases with automated GitHub Actions workflows.
- **DevOps & Cloud Deployment**
	- Designed multi-stage Dockerfiles for both API and UI to produce minimal production images.
	- Published Docker images to Docker Hub and later to Amazon ECR.
	- Automated builds, tests, and deployments with CI/CD pipelines in GitHub Actions.
	- Deployed microservice to AWS EC2 (Assignment 1), Docker Hub + EC2 (Assignment 2), and ECS with load balancer (Assignment 3).
- **Front-End Web UI**
	- Built a lightweight testing UI for fragment creation & retrieval.
	- Integrated AWS Cognito Hosted UI for secure login.
	- Allowed fragment creation, listing, updating, conversion, and deletion through the web client.
  
## Technology Stack
- **Languages & Frameworks**: Node.js, Express.js, Passport.js, Markdown-it, Sharp
- **Cloud Services**: AWS EC2, ECS, ECR, S3, DynamoDB, Cognito, CloudWatch
- **DevOps & Tools**: Docker, Docker Hub, GitHub Actions (CI/CD), dotenv, Pino logging
- **Testing**: Jest, Supertest, Hurl, Integration with Docker Compose
  
## Deliverables
- **GitHub Repositories**:
	- fragments (API microservice)
	- fragments-ui (frontend testing UI)
- **Docker Images**: Hosted on Docker Hub and AWS ECR
- **AWS Deployment**: Final system deployed on Elastic Container Service (ECS) with load balancer
- **Documentation**: Technical reports (Assignments 1–3) with screenshots, coverage reports, and system walkthrough

## Learning Outcomes
- Gained hands-on experience with cloud-native app development, from local prototyping to full AWS deployment.
- Practiced CI/CD pipelines, automated testing, and best practices in containerization.
- Strengthened skills in distributed systems, cloud security, and scalable architecture.

## Contributors  

- **Professor David Humphrey** (Instructor, Seneca Polytechnic, CCP555, 2024 Winter)  
- **Di Liu** - [dliu84](https://github.com/dliu84)

## Citation

If you use this project in your work, please cite it as follows:
> Di Liu (2025). *Fragments Microservice*. GitHub. [https://github.com/dliu84/fragments](https://github.com/dliu84/fragments)
<!--CCP555 course works - Lab 1

GitHub repo and local machine:
- create a private GitHub repo, add README file and .gitignore for node file
- in local machine, run:
  - git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY

check staging tree, run:
- git status

add modified files to the staging tree, run
- git add file_1 file_2 file_3 file_4

commit the changes, run:
- git commit -m "message content"

create a folder called src, run:
- mkdir src

open VScode folder in terminal, run:
- code .

run eslint: 
- npm run lint

start the server using any of three methods, run: 
- npm start
- npm run dev
- npm run debug

test the server can be started manually, run:
- 1. node src/server.js
- 2. browse to http://localhost:8080 to check, or run the following step instead:
- 2. in another terminal, run:
     - curl localhost:8080
	
use jq to format, query and transform JSON data:
- curl -s localhost:8080 | jq

run debugger
- 1. set a break point in VScode
- 2. in VScode, run -> start debugging
- 3. in another terminal, run:
     - curl localhost:8080, and the break point will be hit-->

