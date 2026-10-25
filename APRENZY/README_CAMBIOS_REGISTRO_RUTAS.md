# Cambios iniciales APRENZY: registro, códigos y rutas

## Registro por roles
- Estudiante: requiere código de institución y código de salón.
- Docente: requiere código de institución; código de salón opcional.
- Coordinador/administrador: requiere `COORDINATOR_REGISTRATION_CODE` configurado en `backend/.env`. Puede crear una institución (nombre) o vincularse a una existente (código de institución).
- Los roles se validan en backend. Elegir el rol en el formulario no concede privilegios por sí solo.
- Los códigos de institución y salón se generan aleatoriamente. Al crear un curso desde el endpoint, se devuelve su código de acceso.

## Migración de base de datos existente
Si ya tienes la base `aprenzy`, no vuelvas a ejecutar el `schema.sql` sobre ella. Haz copia de seguridad y aplica `backend/database/migration_codigos_registro.sql`. Debes rellenar códigos únicos para colegios/cursos existentes y luego ejecutar los `ALTER ... NOT NULL` comentados.

Si es una base de datos nueva, el `schema.sql` ya contiene las columnas nuevas.

## Rutas del frontend
La navegación utiliza History API, sin añadir una dependencia nueva. Las rutas cambian a `/login`, `/registro`, `/coordinador/inicio`, `/docente/actividades`, `/estudiante/incapacidades`, etc. Vite debe configurarse para fallback SPA en hosting.

## `localhost`
En desarrollo, el host seguirá siendo `localhost:5173`; lo que cambia al navegar es el path (`/docente/actividades`). Para tener un dominio como `aprenzy.com`, hay que desplegar el frontend y backend y configurar DNS/hosting. `localhost` nunca se convierte en un dominio público solo cambiando las rutas.

## Configuración
1. Copia `backend/.env.example` a `backend/.env`.
2. Completa `DATABASE_URL`, `SECRET_KEY` y define un `COORDINATOR_REGISTRATION_CODE` secreto. En el frontend puedes copiar `aprenzy-frontend/.env.example` a `.env` con `VITE_API_URL=http://localhost:8000` en desarrollo; en producción debe ser la URL pública de tu API.
3. No compartas `.env` ni lo subas al repositorio.
4. Instala dependencias del frontend (`npm install`) y backend según `requeriments.txt`.
5. Ejecuta pruebas y verifica manualmente registro/login antes de continuar.

## Consideraciones pendientes
La interfaz de coordinación para administrar colegio/cursos y mostrar/cambiar códigos requiere una pantalla administrativa posterior. En esta primera modificación el curso genera su código en backend y la API lo devuelve; la vista de cursos debe mostrarlo para que el coordinador lo comparta.
