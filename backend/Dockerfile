# Этап сборки (builder)
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm i

# Копируем весь проект
COPY . .

# Собираем проект (NestJS → dist/)
RUN npm run build

# Этап продакшена
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package.json и package-lock.json из builder
COPY --from=builder /app/package*.json ./

# Устанавливаем только production-зависимости
RUN npm i --omit=dev

# Копируем собранные файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Указываем переменные окружения 
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["node", "dist/main.js"]
