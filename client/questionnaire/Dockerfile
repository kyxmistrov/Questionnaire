# Используем Node.js для сборки
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем React-приложение
RUN npm run build

# Используем Nginx для раздачи статики
FROM nginx:latest

# Копируем собранный React-код в Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем конфиг Nginx
COPY nginx-react.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80
EXPOSE 80

# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
