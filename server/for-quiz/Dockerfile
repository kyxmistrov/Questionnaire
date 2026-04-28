# Используем OpenJDK 17
FROM openjdk:17-jdk-slim

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем JAR-файл в контейнер
COPY target/for-quiz-0.0.1-SNAPSHOT.jar /app/for-quiz.jar

# Открываем порт 8080
EXPOSE 8080

# Запускаем сервер
CMD ["java", "-jar", "/app/for-quiz.jar"]
