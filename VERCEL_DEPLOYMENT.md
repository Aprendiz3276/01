# 🚀 Guía: Desplegar en Vercel con GitHub

## Paso 1: Crear un repositorio en GitHub

1. Ve a [https://github.com/new](https://github.com/new)
2. Inicia sesión en tu cuenta de GitHub (o crea una si no tienes)
3. Nombre del repositorio: `miparqueo-app` (o el que prefieras)
4. Descripción: `Sistema de gestión de parqueaderos`
5. Selecciona "Public" (para que Vercel pueda acceder)
6. **NO** inicialices con README, .gitignore o licencia (ya los tenemos)
7. Haz clic en "Create repository"

## Paso 2: Vincular repositorio local a GitHub

En la terminal, dentro de tu proyecto, ejecuta:

```powershell
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"

# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/miparqueo-app.git

# Cambiar rama a 'main' si es necesario
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub real**

## Paso 3: Conectar GitHub con Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" o inicia sesión
3. Selecciona "Continue with GitHub" (recomendado)
4. Autoriza a Vercel para acceder a tu GitHub
5. Haz clic en "New Project"
6. Busca y selecciona el repositorio `miparqueo-app`
7. Haz clic en "Import"

## Paso 4: Configurar variables de entorno en Vercel

En la página de importación del proyecto:

1. En la sección "Environment Variables", agrega:
   - **DB_TYPE**: `postgresql` (si usas PostgreSQL) o `sqlite`
   - **PG_HOST**: tu host de PostgreSQL (ej: localhost o tu servidor remoto)
   - **PG_PORT**: `5432`
   - **PG_DATABASE**: nombre de tu base de datos
   - **PG_USER**: usuario de PostgreSQL
   - **PG_PASSWORD**: contraseña de PostgreSQL
   - **PORT**: `3000` (opcional, Vercel asigna automáticamente)
   - **NODE_ENV**: `production`

2. Haz clic en "Deploy"

## Paso 5: Esperar el despliegue

- Vercel compilará y desplegará tu proyecto automáticamente
- Recibirás un enlace como: `https://miparqueo-app-xxxxx.vercel.app`
- El despliegue toma entre 1-5 minutos

## ⚠️ Consideraciones importantes:

### Base de datos en Vercel:
- Si usas SQLite, considera migrarlo a **PostgreSQL** (mejor para producción)
- Servicios recomendados: **Supabase**, **Railway.app**, o **Heroku Postgres**

### API Routes alternativa:
Si tienes problemas, puedes usar API Routes de Vercel con este en `api/` folder:

```
api/
  ├── auth.js
  ├── parking.js
  ├── reservations.js
  └── users.js
```

## Despliegues futuros:

Después de la primera configuración, cada vez que hagas `push` a GitHub, Vercel desplegará automáticamente:

```powershell
git add .
git commit -m "Descripción de cambios"
git push origin main
```

## 🐛 Solucionar problemas:

- **Error 404 en API**: Verifica que las rutas en `server.js` están correctas
- **Error de base de datos**: Revisa que las credenciales están en variables de entorno
- **Build fails**: Revisa los logs en el dashboard de Vercel

¡Éxito! 🎉
