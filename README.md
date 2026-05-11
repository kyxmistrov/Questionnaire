# 📋 Questionnaire Project

A web application for creating and completing questionnaires/surveys with a client-server architecture.

---
```
project/
├── client/ # Frontend (React)
│ └── questionnaire/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── Dockerfile
│
├── server/ # Backend (Spring Boot)
│ └── for-quiz/
│ ├── src/
│ ├── pom.xml
│ ├── mvnw
│ └── Dockerfile
│
├── DB/ # Database
│ └── БД-postgresql.sql
│
├── .gitignore
└── README.md
```
---

## ⚙️ Technologies

### 🎨 Client (Frontend)
- React
- JavaScript
- CSS
- Axios (for API requests)

### 🧠 Server (Backend)
- Java
- Spring Boot
- Spring Data JPA
- REST API

### 🗄 Database
- PostgreSQL
- SQL scripts and database schema

---

## 🖼 Screenshots

### Home Page
<img width="614" height="483" alt="image" src="https://github.com/user-attachments/assets/6acff171-8536-4b75-8f0c-fe16c6b9bf5f" />

### Test Creation
<img width="708" height="735" alt="image" src="https://github.com/user-attachments/assets/4a2f6e9d-89c9-443c-bf1f-f71ac11e2323" />

### User Survey/Test Dashboard
<img width="1840" height="547" alt="image" src="https://github.com/user-attachments/assets/07597e5a-ab99-4dbf-9901-15cc4d3973b2" />

### Test Results
<img width="1795" height="864" alt="image" src="https://github.com/user-attachments/assets/d10a31ac-901c-4895-ab3a-c7f636ac630f" />

---

## 🚀 Project Setup

### 1️⃣ Backend (server)

```bash
cd server/for-quiz
./mvnw spring-boot:run

or (Windows):
```bash
mvnw.cmd spring-boot:run
```

---

### 2️⃣ Frontend (client)

```bash
cd client/questionnaire
npm install
npm start
```

---

### 3️⃣ Database

Import the file:

```
DB/БД-postgresql.sql
```

в PostgreSQL

---

## 📡 Architecture

```
[ React Client ]
        ↓ HTTP (REST API)
[ Spring Boot Server ]
        ↓
[ PostgreSQL Database ]
```

---

## 📌 Core Features

- User registration and authentication
- Questionnaire / test creation
- Test participation
- Result storage and tracking
- Support for multiple question types:
  - single choice
  - multiple choice
  - text answers
  - priority ranking

---

## 🐳 Docker (if used)

```bash
docker-compose up --build
```

---

## 👨‍💻 Author

Igor Kukhmistrov 
---

## 📌 Notes

This project is structured as a monorepository:

frontend and backend are developed separately
both are stored in a single GitHub repository
