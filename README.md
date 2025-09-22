# ANMAR25_D03_COMPASSEVENT

[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/) 
[![NestJS](https://img.shields.io/badge/NestJS-Framework-red)](https://nestjs.com/) 
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/) 
[![Docker](https://img.shields.io/badge/Docker-Container-blue)](https://www.docker.com/)
[![AWS](https://img.shields.io/badge/AWS-DynamoDB%20%7C%20S3%20%7C%20SES-orange)](https://aws.amazon.com/) 
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

---

## 📄 Overview
**ANMAR25_D03_COMPASSEVENT** is the initial development of a system for **Compass Events**, a company specialized in event creation, management, and participant registration.  
The goal of this project is to provide an efficient platform for organizing events, managing registrations, and streamlining event management workflows.

---

## ⚠️ Disclaimer

This project is under active development and may undergo structural changes.  
Some areas, including code organization, testing, and DynamoDB query handling, may be revised or improved in future updates.
Users should consider this repository as a work-in-progress and may encounter incomplete features or refactoring changes.

---

## ✨ Features
This project leverages the following core technologies:

- **Node.js** — JavaScript runtime  
- **NestJS** — Scalable and maintainable server-side framework  
- **TypeScript** — Strongly typed language built on JavaScript
- **Docker & Docker Compose** — Containerized local environment for the API and supporting services (recommended for local development and testing)
- **AWS SDK** — Integration with AWS services (DynamoDB, S3, SES) 
- **DynamoDB** — NoSQL database  
- **S3** — Object storage  
- **SES (Simple Email Service)** — Email service  
- **Swagger** — Interactive API documentation  
- **JWT & Passport** — Authentication and authorization  
- **Jest & Supertest** — Unit and integration testing *(partial)*  
- **Pino** — High-performance logging  
- **ESLint, Prettier, Husky, Lint-staged** — Code quality, formatting, Git hooks  
- **Helmet & CORS** — Security and HTTP headers management  

---

## ⚙️ Environment Variables
Create a `.env` file in the project root with the following configuration:

```env
NODE_ENV=development # change to 'production' for production environment
PORT=3000
APP_URL=http://localhost:3000
GLOBAL_PREFIX=api/v1

# AWS Settings
AWS_ACCOUNT=123456789012 # your AWS account ID
AWS_REGION=us-east-1     # your AWS region

# DynamoDB table names
DYNAMO_ENDPOINT=http://localhost:8000
AWS_DYNAMODB_USERS_TABLE=Users
AWS_DYNAMODB_EVENTS_TABLE=Events
AWS_DYNAMODB_SUBSCRIPTIONS_TABLE=Subscriptions

# JWT Settings
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d

# Default Admin User (for dev/testing)
DEFAULT_ADMIN_NAME=Admin
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=password123 # DO NOT USE IN PRODUCTION
DEFAULT_ADMIN_PHONE=+559999999999

# AWS SES Email
AWS_SES_FROM_EMAIL=youremail@example.com

# AWS S3 Buckets & Folders
AWS_S3_BUCKET_NAME=compass-event
AWS_S3_FOLDER_USERS_ORIGINALS=users/originals
AWS_S3_FOLDER_USERS_RESIZED=users/resized
AWS_S3_FOLDER_EVENTS_ORIGINALS=events/originals
AWS_S3_FOLDER_EVENTS_RESIZED=events/resized

# AWS Lambda
LAMBDA_FUNCTION_NAME=compass-event-image-resize
```

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Caio-Renan/ANMAR25_D03_COMPASSEVENT.git
cd ANMAR25_D03_COMPASSEVENT
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure AWS credentials
This project uses **aws-vault** for secure credential management.  
It encrypts your AWS access keys and generates temporary sessions for AWS CLI or SDK commands.

#### Installation
- **macOS**
```bash
brew install --cask aws-vault
```

- **Windows (Chocolatey)**
```bash
choco install aws-vault
```

- **Windows (manual)**
1. Download the latest release from [aws-vault GitHub Releases](https://github.com/99designs/aws-vault/releases)  
2. Rename `aws-vault-windows-amd64.exe` to `aws-vault.exe`  
3. Place it in a folder included in your PATH (e.g., `C:\Program Files\aws-vault\`)  
4. Add the folder to the system PATH (Control Panel → System → Advanced Settings → Environment Variables → Path)  
5. Verify installation:
```bash 
aws-vault --version
```

#### Initial Setup
- Add an AWS profile:
```bash
aws-vault add compass-event-dev
```

- List stored profiles:
```bash
aws-vault list
```

- Remove a profile:
```bash
aws-vault remove <profile-name>
```

#### AWS CLI Configuration
If this is your first time using the AWS CLI, the file `~/.aws/config` may not exist yet.  
Create it manually and add the following profile configuration (adjust values as needed):

```ini
[profile compass-event-dev]
region = yourRegion
role_arn = arn:aws:iam::123456789012:role/YourRole
mfa_serial = arn:aws:iam::123456789012:mfa/YourMfaDevice (if you use it)
role_session_name = yourName
output = json

[default]
region = yourRegion
output = json
```

#### Alternative (without aws-vault)
Add the following variables to your `.env` file instead:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token # optional, only for temporary credentials
```


### 4. Deploy Infrastructure
Navigate to the **infra** folder:
```bash
cd infra/
```

Bootstrap and deploy with **aws-vault**:
```bash
npm run bootstrap:vault
npm run deploy:all:vault
```

If you are not using aws-vault, remove `:vault` from the commands.

### 5. Run the application
#### Using Docker (recommended)
Exit the **infra** folder and run:
```bash
npm run dev:up:vault
```

If not using aws-vault:
```bash
npm run dev:up
```

##### 🐳 Useful Docker Commands

| Command                           | Description                                                       |
|-----------------------------------|-------------------------------------------------------------------|
| `npm run dev:restart`             | Stops containers and restarts them                                |
| `npm run dev:restart:vault`       | Same as above, but with **AWS Vault** session                     |
| `npm run dev:restart:light`       | Restarts containers without rebuilding images                     |
| `npm run dev:restart:light:vault` | Same as above, but with **AWS Vault** session                     |
| `npm run dev:up:no-build`         | Starts containers without rebuilding images                       |
| `npm run dev:up:no-build:vault`   | Same as above, but with **AWS Vault** session                     |
| `npm run dev:start:logs`          | Starts containers and follows logs                                |
| `npm run dev:start:logs:vault`    | Same as above, but with **AWS Vault** session                     |


#### Without Docker
```bash
npm run start:dev
```

### 6. Seed the database
If running via Docker, the seed runs automatically.  
If running locally (without Docker):

```bash
npm run seed
```

---

## 📚 API Documentation

### Swagger
Access the Swagger UI at:  
```bash
http://localhost:3000/api/docs
```

### Endpoints

#### **Users**
| Method | Endpoint             | Description                                  | 
| ------ | -------------------- | -------------------------------------------- | 
| POST   | /api/v1/users      | Create a new user                            | 
| GET    | /api/v1/users      | List users with filters & pagination (admin) | 
| GET    | /api/v1/users/{id} | Get user by ID (self)                        | 
| PATCH  | /api/v1/users/{id} | Update user (self)                           |
| DELETE | /api/v1/users/{id} | Soft delete user (self)                      | 

#### **Events**
| Method | Endpoint              | Description                                   | 
| ------ | --------------------- | --------------------------------------------- | 
| POST   | /api/v1/events      | Create a new event (admin/organizer)          |
| GET    | /api/v1/events      | List events with filters & pagination         | 
| GET    | /api/v1/events/{id} | Get event by ID                               | 
| PATCH  | /api/v1/events/{id} | Update event (admin/event organizer)                | 
| DELETE | /api/v1/events/{id} | Soft delete event (admin/event organizer)           | 

#### **Calendar**
| Method | Endpoint                         | Description                               |
| ------ | -------------------------------- | ----------------------------------------- |
| GET    | /api/v1/calendar/{eventId}.ics | Download event calendar (.ics) with token |

#### **Subscriptions**
| Method | Endpoint                     | Description                                   | 
| ------ | ---------------------------- | --------------------------------------------- |
| POST   | /api/v1/subscriptions      | Create a subscription (user/organizer)        | 
| GET    | /api/v1/subscriptions      | List own subscriptions                        |
| DELETE | /api/v1/subscriptions/{id} | Soft delete own subscription                  | 

#### **Auth**
| Method | Endpoint                              | Description                       |
| ------ | ------------------------------------- | --------------------------------- |
| POST   | /api/v1/auth/verify-email           | Verify user email with token      |
| POST   | /api/v1/auth/login                  | User login and token retrieval    |
| POST   | /api/v1/auth/request-password-reset | Send password reset email         |
| POST   | /api/v1/auth/reset-password         | Reset password with token         |

---

## 🔑 Authentication in Swagger
To use protected routes, log in first, then paste the JWT token into the **Authorize** button in Swagger UI:

![Swagger Auth](https://github.com/user-attachments/assets/d4010bc4-36b9-4e29-b871-bd165c186a6e)

---

## 📖 Pagination
When using queries with limit, if results exceed the limit, a LastEvaluatedKey will be returned.  
Use this key in the next request to continue fetching results.

![Pagination Example 1](https://github.com/user-attachments/assets/ac99cac2-9bea-4cf0-883b-150b89ea39b5)  
![Pagination Example 2](https://github.com/user-attachments/assets/9b88e00f-e4c1-43ac-b245-a8aae1c248b5)

---

## 📜 License

This project is licensed under the [MIT License](https://github.com/Caio-Renan/ANMAR25_D03_COMPASSEVENT?tab=MIT-1-ov-file).


