# StayHub

Plataforma web tipo Booking para **explorar alojamientos** (hoteles, casas, departamentos, etc.) y gestionar un catálogo desde un panel de administración.  
Proyecto final (Digital House).

---

## Estado del proyecto
- ✅ **Sprint 1 (Backend):** API base de accommodations (CRUD + paginación + random + admin list) + validaciones + manejo de errores + seed de datos.
- ⏳ **Sprint 1 (Frontend):** en progreso.

---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Web + Spring Data JPA
- MySQL (Docker)
- Swagger / OpenAPI

### Frontend
- (por definir / en progreso)

---

## Estructura del repo
stayhub/
  -backend/ # API Spring Boot
  -frontend/ # Frontend (en progreso)
  -docker-compose.yml

## Requisitos
- Docker + Docker Compose
- Java 17 (recomendado: Temurin)


## Nota Seed de datos (dev)

El backend incluye un seeder que carga datos iniciales cuando la base está vacía.
Si querés “reiniciar” datos de cero:

docker compose down -v
docker compose up -d

Luego reiniciá el backend.

--------------

## Cómo correr el proyecto (local)

### 1) Levantar la base de datos
Desde la **raíz** del repo:

```bash
docker compose up -d
```

### 2) Configurar variables de entorno
Crear el archivo backend/.env  con:
DB_URL=jdbc:mysql://localhost:3306/stayhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root

### 3) Correr el backend
Desde backend/:
```./mvnw spring-boot:run```

El backend corre en:

API base: http://localhost:8080/api

Health: http://localhost:8080/api/health

Swagger UI: http://localhost:8080/api/swagger-ui/index.html


--------

## 👤 Autor
- [@Nahuel7709] (https://github.com/Nahuel7709)
