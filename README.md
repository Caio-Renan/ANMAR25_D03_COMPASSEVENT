## ANMAR25_D03_COMPASSEVENT

## 📄 Overview

ANMAR25_D03_COMPASSEVENT is the initial development of a system for Compass Events, a company specialized in event creation, management, and participant registration. This project aims to provide an efficient platform for organizing events, handling registrations, and streamlining event management processes.

---

## Features

- This project is built with the following core technologies:
- Node.js — JavaScript runtime
- NestJS — Progressive Node.js framework for building scalable and maintainable server-side applications
- TypeScript — Strongly typed programming language that builds on JavaScript
- AWS SDK — Integration with AWS services like DynamoDB, S3, and SES *(incomplete)*
- DynamoDB — NoSQL database service from AWS
- S3 — Object storage service from AWS *(incomplete)*
- SES (Simple Email Service) — Email sending service from AWS *(incomplete)*
- Swagger — API documentation and testing
- JWT & Passport — Authentication and security
- Jest & Supertest — Unit and integration testing *(incomplete)*
- Pino — High-performance logging
- ESLint, Prettier, Husky, Lint-staged — Code quality, formatting, and Git hooks automation
- Helmet & CORS — Security and HTTP headers management

## ⚙️ Environment Variables
Before running the application, create a .env file in the root directory and configure the following environment variables:

```env
NODE_ENV=production
PORT=3000

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY
AWS_ACCOUNT=123456789012

AWS_DYNAMODB_ENDPOINT=http://localhost:8000
AWS_DYNAMODB_USERS_TABLE=Users
AWS_DYNAMODB_EVENTS_TABLE=Events
AWS_DYNAMODB_SUBSCRIPTIONS_TABLE=Subscriptions

DEFAULT_USER_NAME=Admin User
DEFAULT_USER_EMAIL=admin@compassevents.com
DEFAULT_USER_PASSWORD=AdminPassword123!
DEFAULT_USER_PHONE=+55999999999
DEFAULT_USER_ROLE=admin

JWT_SECRET=mySuperSecretKey123!
JWT_EXPIRES_IN=1d

AWS_S3_BUCKET_NAME=compass-events-bucket
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=no-reply@compassevents.com
```
🚀 Installation & Setup
Follow these steps to run the project locally:

1. Clone the repository

```bash
git clone https://github.com/Caio-Renan/ANMAR25_D03_COMPASSEVENT.git
cd ANMAR25_D03_COMPASSEVENT
```
2. Install dependencies

```bash
npm install
```

3. Configure AWS credentials

- Add your credentials to the ~/.aws/credentials file or use the command below:

```bash
aws configure
```

4. Set up environment variables

- Create a .env file in the root folder based on the example provided above.

5. Deploy infrastructure (DynamoDB tables, etc.)
Navigate to the infrastructure folder:

```bash
cd infra/
```

Deploy using AWS CDK:

```bash
cdk deploy --all --app "npx ts-node bin/infra.ts"
```

6. Seed the database
Return to the root folder and run:

```bash
npm run seed
```

7. Run the application

```bash
npm run start:dev
```

## 🛠️ Available Scripts

![image](https://github.com/user-attachments/assets/a0c089e1-d4ab-4b83-9af0-d5a04e37d3f9)

## 📁 Folder Structure
```plaintext
src
├── app.module.ts
├── main.ts
├── config
│   ├── aws
│   └── ...
├── common
│   ├── aws
│   ├── auth
│   ├── constants
│   ├── decorators
│   ├── enums
│   ├── exceptions
│   ├── guards
│   ├── logger
│   ├── value-objects
│   ├── interceptors
│   └── pipes
├── modules
│   ├── user
│   │   ├── controllers
│   │   ├── dtos
│   │   ├── entities
│   │   ├── repositories
│   │   ├── services
│   │   ├── interfaces
│   │   └── user.module.ts
│   ├── auth
│   │   ├── controllers
│   │   ├── dtos
│   │   ├── services
│   │   ├── interfaces
│   │   ├── strategies
│   │   └── auth.module.ts
│   ├── event
│   │   ├── controllers
│   │   ├── dtos
│   │   ├── entities
│   │   ├── repositories
│   │   ├── services
│   │   ├── interfaces
│   │   └── event.module.ts
│   ├── subscription
│   │   ├── controllers
│   │   ├── dtos
│   │   ├── entities
│   │   ├── repositories
│   │   ├── services
│   │   ├── interfaces
│   │   └── subscription.module.ts
│   └── mail
│       ├── controllers
│       ├── dtos
│       ├── enums
│       ├── templates
│       ├── services
│       └── mail.module.ts
tests
├── unit
│   ├── decorators
│   ├── exceptions
│   ├── guards
│   ├── logger
│   ├── value-objects
│   └── ...
scripts
└── seed.ts
infra
├── bin
├── lib
│   └── stacks
└── test
```

## 📚 Swagger endpoint
```bash
http://localhost:3000/api/docs
```

## 📚 API Documentation
The project exposes the following REST API endpoints, organized by resource:

### `User`

| Method | Endpoint             | Description                          | 
| ------ | -------------------- | ------------------------------------ | 
| POST   | `/api/v1/users`      | Create a new user                    | 
| GET    | `/api/v1/users`      | List users with filters & pagination | 
| GET    | `/api/v1/users/{id}` | Get user by ID                       | 
| PATCH  | `/api/v1/users/{id}` | Update user                          |
| DELETE | `/api/v1/users/{id}` | Soft delete user                     | 

### `Events`

| Method | Endpoint              | Description                           | 
| ------ | --------------------- | ------------------------------------- | 
| POST   | `/api/v1/events`      | Create a new event                    |
| GET    | `/api/v1/events`      | List events with filters & pagination | 
| GET    | `/api/v1/events/{id}` | Get event by ID                       | 
| PATCH  | `/api/v1/events/{id}` | Update event                          | 
| DELETE | `/api/v1/events/{id}` | Soft delete event                     | 

### `Subscriptions`

| Method | Endpoint                     | Description               | 
| ------ | ---------------------------- | ------------------------- |
| POST   | `/api/v1/subscriptions`      | Create a new subscription | 
| GET    | `/api/v1/subscriptions`      | List own subscriptions    |
| DELETE | `/api/v1/subscriptions/{id}` | Soft delete subscription  | 

### `Auth`

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/v1/auth/login` | User login and token retrieval |

## Pagination

When using a query with limit, if the number of items exceeds the limit, a LastEvaluatedKey will be generated. You should copy and paste this key into the respective field in the next request to continue pagination.

![Screenshot_23](https://github.com/user-attachments/assets/ac99cac2-9bea-4cf0-883b-150b89ea39b5)

![Screenshot_24](https://github.com/user-attachments/assets/9b88e00f-e4c1-43ac-b245-a8aae1c248b5)









