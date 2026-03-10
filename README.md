# StayHub

StayHub es una plataforma web tipo Booking para **explorar alojamientos** (hoteles, casas, departamentos, hostels, BnB) y administrar el catálogo desde un panel interno.

Proyecto final de **Digital House**.

---

## Estado del proyecto

### ✅ Sprint 1
- Home pública
- Listado de alojamientos
- Detalle de alojamiento
- Panel de administración base
- Backend inicial de accommodations
- Seeder de datos
- Paginación, recomendados y listados random

### ✅ Sprint 2
- Autenticación con JWT
- Registro y login
- Endpoint `/auth/me`
- Roles `ADMIN` y `USER`
- CRUD y administración de categorías
- CRUD y administración de características
- Relación many-to-many entre alojamientos y características
- Detalle enriquecido con categoría, features e imágenes
- Upload de imágenes para alojamientos
- Frontend conectado a backend real

### ✅ Sprint 3
- Búsqueda real de alojamientos por texto
- Búsqueda con rango de fechas
- Disponibilidad por alojamiento
- Endpoint de disponibilidad
- Seeder de reservas de ejemplo
- Bloque de políticas del producto
- Visualización de fechas ocupadas en el detalle
- Consulta de disponibilidad desde el detalle
- Listado filtrado por disponibilidad

---

## Funcionalidades actuales

### Público
- Ver home
- Explorar alojamientos
- Buscar por ciudad, país o nombre del alojamiento
- Filtrar por fechas disponibles
- Ver detalle de cada alojamiento
- Ver políticas del alojamiento
- Consultar disponibilidad de fechas
- Ver categorías y características

### Usuario autenticado
- Registrarse
- Iniciar sesión
- Consultar su sesión con `/auth/me`

### Administrador
- Crear alojamientos
- Eliminar alojamientos
- Crear y eliminar categorías
- Crear, editar y eliminar características
- Acceder al panel de administración

---

## Documentación

En la carpeta `docs/` se incluye material del proyecto, por ejemplo:

- Bitácora / resumen Sprint 1
- Bitácora / resumen Sprint 2
- Manual de identidad de marca

---

## Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Spring Security
- JWT
- MySQL
- Swagger / OpenAPI

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Infra / entorno
- Docker
- Docker Compose

---

## Estructura del repositorio

```text
stayhub/
├── backend/              # API Spring Boot
├── frontend/             # React + Vite + Tailwind
├── docs/                 # Documentación del proyecto
└── docker-compose.yml
```
---

## Requisitos
- Docker + Docker Compose
- Java 17
- Node.js
- npm

---

## Como correr el proyecto en local 

1) Levantar la base de datos
Desde la raíz del repo:
```docker compose up -d```

2) Configurar variables de entorno
Crear el archivo backend/.env con:
DB_URL=jdbc:mysql://localhost:3306/stayhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=stayhub_super_secret_key_2026_muy_larga_y_segura
JWT_EXPIRATION_MS=86400000

3) Correr el backend
Desde backend/:

#### Git Bash / WSL / Linux / macOS
```./mvnw spring-boot:run```

#### PowerShell
```.\mvnw.cmd spring-boot:run```

#### CMD
```mvnw.cmd spring-boot:run```

Backend disponible en:
- API base: http://localhost:8080/api
- Health: http://localhost:8080/api/health
- Swagger UI: http://localhost:8080/api/swagger-ui/index.html


4) Correr el frontend

Desde frontend/:
```
npm install
npm run dev 
```
Frontend disponible en:
- http://localhost:5173

---

## Seed de datos de desarrollo

El backend incluye un seeder que crea automáticamente:

- Usuario administrador

- Usuario estándar

- Categorías

- Características

- Alojamientos de ejemplo

- Políticas por tipo de alojamiento

- Reservas de ejemplo para probar disponibilidad

- Usuarios seed

#### ADMIN

- Email: admin@stayhub.com
- Password: Admin12345

#### USER

- Email: user@stayhub.com
- Password: User12345

## Reiniciar datos de desarrollo

Si querés reiniciar la base desde cero:
```
docker compose down -v
docker compose up -d
```
Si además querés borrar imágenes subidas manualmente:

- PowerShell:
```Remove-Item -Recurse -Force backend\uploads```

- Git Bash / Linux / macOS
```rm -rf backend/uploads```

Luego reiniciá el backend.

---
## Endpoints principales

### Auth

- POST /auth/register
- POST /auth/login
- GET /auth/me

### Accommodations

-GET /accommodations
-GET /accommodations/random
-GET /accommodations/{id}
-GET /accommodations/{id}/availability
-POST /accommodations (ADMIN)
-DELETE /accommodations/{id} (ADMIN)
-GET /accommodations/admin (ADMIN)
-GET /accommodations/admin/cards (ADMIN)

### Categories

-GET /categories
-POST /categories (ADMIN)
-DELETE /categories/{id} (ADMIN)

### Features

- GET /features
- POST /features (ADMIN)
- PUT /features/{id} (ADMIN)
- DELETE /features/{id} (ADMIN)

---
## Búsqueda y disponibilidad

Actualmente el endpoint GET /accommodations soporta:

- page
- size
- categoryId
- query
- startDate
- endDate

Ejemplo:
GET /api/accommodations?query=bariloche&startDate=2026-03-20&endDate=2026-03-24&size=10

Y cada alojamiento expone disponibilidad con:
GET /api/accommodations/{id}/availability
GET /api/accommodations/{id}/availability?startDate=2026-03-20&endDate=2026-03-24

---
## Autor: Nahuel7709