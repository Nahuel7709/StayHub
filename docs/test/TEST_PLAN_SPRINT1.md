# Plan de Pruebas – Sprint 1 (StayHub)

## Objetivo
Validar que las funcionalidades implementadas en Sprint 1 cumplan los criterios de aceptación:
- Home con buscador, categorías y recomendaciones.
- Listado “Explorar” con paginación.
- Detalle de alojamiento con imágenes y descripción.
- Panel Admin: listar, alta con imágenes (upload) y eliminar con confirmación.

## Alcance
Incluye pruebas manuales sobre:
- Backend (Swagger)
- Frontend (UI)

No incluye: autenticación real, pagos, reservas reales, deploy.

## Entorno
- Backend: Spring Boot (http://localhost:8080/api)
- Frontend: Vite (http://localhost:5173)
- DB: MySQL (Docker Compose)
- Swagger: http://localhost:8080/api/swagger-ui/index.html



---

## Casos de prueba (ejecutados)

### TC-01 – Health check API
**Pasos:**
1. Swagger → `GET /health`
2. Ejecutar  
**Resultado esperado:** 200 OK  
**Ejecución:** ✅ OK

---

### TC-02 – Crear alojamiento (multipart) con 1+ imágenes
**Pasos:**
1. Swagger → `POST /accommodations` (multipart/form-data)
2. Completar: name, description, type, city, country, pricePerNight
3. Adjuntar 1+ imágenes en `images`
4. Ejecutar  
**Resultado esperado:**
- 201 Created
- Response incluye `images[].url` con `/api/uploads/<archivo>`  
**Ejecución:** ✅ OK

---

### TC-03 – Validación: crear alojamiento sin imágenes
**Pasos:**
1. Swagger → `POST /accommodations` (multipart)
2. Completar campos pero NO adjuntar imágenes
3. Ejecutar  
**Resultado esperado:** 400 Bad Request con mensaje de validación (“Debe incluir al menos 1 imagen”)  
**Ejecución:** ✅ OK

---

### TC-04 – Home: secciones visibles
**Pasos:**
1. Front → ir a `/`
2. Verificar que se visualicen los bloques:
   - Buscador
   - Categorías
   - Recomendados  
**Resultado esperado:** Se visualizan las 3 secciones y el layout es responsive  
**Ejecución:** ✅ OK

---

### TC-05 – Recomendados: recarga y navegación
**Pasos:**
1. Home → sección “Recomendados”
2. Click “Recargar”
3. Click “Ver detalle” en un card  
**Resultado esperado:**
- Recargar trae nuevos alojamientos (random)
- “Ver detalle” navega al detalle  
**Ejecución:** ✅ OK

---

### TC-06 – Listado Explorar con paginación (10 por página)
**Pasos:**
1. Home → “Explorar todos” (va a `/accommodations`)
2. Verificar 10 items por página
3. Cambiar de página y volver a página 1  
**Resultado esperado:** Paginación funciona y mantiene navegación correcta  
**Ejecución:** ✅ OK

---

### TC-07 – Detalle de alojamiento
**Pasos:**
1. Ir a `/accommodations/:id`
2. Verificar:
   - Título alineado a la izquierda
   - Botón/acción “Volver” alineada a la derecha (según consigna)
   - Descripción visible
   - Imágenes visibles (y ver más / modal si aplica)  
**Resultado esperado:** UI coincide con criterios del sprint  
**Ejecución:** ✅ OK

---

### TC-08 – Admin: listado de alojamientos
**Pasos:**
1. Ir a `/administracion/lista`
2. Ver listado con acciones  
**Resultado esperado:** Se muestra listado + botón “Agregar alojamiento”  
**Ejecución:** ✅ OK

---

### TC-09 – Admin: alta desde formulario con preview y quitar imágenes
**Pasos:**
1. Ir a `/administracion/agregar` (o tu ruta de alta)
2. Cargar datos del alojamiento
3. Seleccionar múltiples imágenes y verificar preview
4. Quitar una imagen seleccionada
5. Guardar  
**Resultado esperado:**
- Preview se visualiza
- Se puede quitar una imagen
- Se crea alojamiento y vuelve a la lista  
**Ejecución:** ✅ OK

---

### TC-10 – Admin: eliminar alojamiento con confirmación
**Pasos:**
1. Ir a `/administracion/lista`
2. Click “Eliminar”
3. Confirmar en modal
4. Verificar que ya no aparece  
**Resultado esperado:**
- Aparece confirmación
- Si acepta, elimina en DB
- El alojamiento ya no se muestra en el listado  
**Ejecución:** ✅ OK

---

## Resumen de ejecución
| Caso | Resultado |
|------|----------|
| TC-01 | ✅ OK |
| TC-02 | ✅ OK |
| TC-03 | ✅ OK |
| TC-04 | ✅ OK |
| TC-05 | ✅ OK |
| TC-06 | ✅ OK |
| TC-07 | ✅ OK |
| TC-08 | ✅ OK |
| TC-09 | ✅ OK |
| TC-10 | ✅ OK |