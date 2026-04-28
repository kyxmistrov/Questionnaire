# 📋 Questionnaire Project

Полноценное веб-приложение для создания и прохождения анкет/опросов с клиент-серверной архитектурой.

---

## 📦 Структура проекта

```
project/
├── client/                     # Frontend (React)
│   └── questionnaire/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── Dockerfile
│
├── server/                     # Backend (Spring Boot)
│   └── for-quiz/
│       ├── src/
│       ├── pom.xml
│       ├── mvnw
│       └── Dockerfile
│
├── DB/                         # База данных
│   └── БД-postgresql.sql
│
├── .gitignore
└── README.md
```

---

## ⚙️ Технологии

### 🎨 Client (Frontend)
- React
- JavaScript
- CSS
- Axios (для запросов к API)

### 🧠 Server (Backend)
- Java
- Spring Boot
- Spring Data JPA
- REST API

### 🗄 Database
- PostgreSQL
- SQL-скрипты и структура БД

---

## 🚀 Запуск проекта

### 1️⃣ Backend (server)

```bash
cd server/for-quiz
./mvnw spring-boot:run
```

или (Windows):
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

### 3️⃣ База данных

Импортировать файл:

```
DB/БД-postgresql.sql
```

в PostgreSQL

---

## 📡 Архитектура

```
[ React Client ]
        ↓ HTTP (REST API)
[ Spring Boot Server ]
        ↓
[ PostgreSQL Database ]
```

---

## 📌 Основной функционал

- Регистрация и авторизация пользователей
- Создание анкет / тестов
- Прохождение тестов
- Сохранение результатов
- Работа с вопросами разных типов:
  - одиночный выбор
  - множественный выбор
  - текстовые ответы
  - приоритеты

---

## 🐳 Docker (если используется)

```bash
docker-compose up --build
```

---

## 👨‍💻 Автор
Игорь Кухмистров  
---

## 📌 Примечание

Проект собран как монорепозиторий:
- frontend и backend развиваются отдельно
- общая структура в одном GitHub репозитории
