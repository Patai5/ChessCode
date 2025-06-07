# Build Frontend
FROM node:20 AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

# Build Backend
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=backend.settings

WORKDIR /backend

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/setup.cfg /backend/pyproject.toml .
RUN pip install --no-cache-dir .

COPY backend/ .
COPY --from=frontend-builder /frontend/static ../frontend/static

RUN python manage.py migrate --run-syncdb
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]