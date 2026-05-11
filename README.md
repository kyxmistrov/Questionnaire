# 📋 Questionnaire Project

Веб-приложение для создания и прохождения анкет/опросов с клиент-серверной архитектурой.

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
## Скрины
### Главная страница
<img width="614" height="483" alt="image" src="https://github.com/user-attachments/assets/6acff171-8536-4b75-8f0c-fe16c6b9bf5f" />

### Создание теста
<img width="708" height="735" alt="image" src="https://github.com/user-attachments/assets/4a2f6e9d-89c9-443c-bf1f-f71ac11e2323" />

### Панель анкет/тестов пользователя
<img width="1840" height="547" alt="image" src="https://github.com/user-attachments/assets/07597e5a-ab99-4dbf-9901-15cc4d3973b2" />

### Результаты прохождения теста
<img width="1795" height="864" alt="image" src="https://github.com/user-attachments/assets/d10a31ac-901c-4895-ab3a-c7f636ac630f" />

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
