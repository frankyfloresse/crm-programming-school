# CRM Programming School

A simple CRM system for managing programming school orders and students.

## Tech Stack

- **Backend**: NestJS, TypeORM, MySQL
- **Frontend**: React, TypeScript, Redux Toolkit, Tailwind CSS, DaisyUI
- **Authentication**: JWT with refresh tokens

## Quick Start with Docker

#### 1. Setup environment:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### 2. Setup database

Go to `backend/.env` and fill up your database credentials. Example:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=database
```

#### 3. Run the application:

```bash
docker-compose up -d --build
```

#### 4. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Swagger: http://localhost:3001/api

##### Default user:

- Login: admin@gmail.com
- Password: admin

#### Postman collection

See `CRM.postman_collection.json` file
