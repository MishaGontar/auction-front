# Використовуємо офіційний образ Node.js для збірки
FROM node:18 AS build

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо файли package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів
COPY . .

# Створюємо збірку додатка
RUN npm run build

# Використовуємо інший офіційний образ Node.js для сервера
FROM node:18

# Встановлюємо робочу директорію в контейнері
WORKDIR /app

# Копіюємо збудований код
COPY --from=build /app/dist /app/dist

# Встановлюємо сервіс для обслуговування фронтенду
RUN npm install -g serve

# Вказуємо порт, на якому буде працювати сервіс
EXPOSE 3000

# Запускаємо сервіс для обслуговування збірки
CMD ["serve", "-s", "dist", "-l", "3000"]
