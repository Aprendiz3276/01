# Solución para Error 500 en Vercel

## Problema Identificado
El error `FUNCTION_INVOCATION_FAILED` ocurre porque:
1. **La base de datos no se inicializa** - El middleware de inicialización faltaba en `api/index.js`
2. **Variables de entorno no configuradas** - Vercel necesita las credenciales de la base de datos

## Soluciones Implementadas

### 1. ✅ Actualización de `api/index.js`
Se agregó:
- Importación de `initializeDatabase()` desde `backend/database.js`
- Middleware de inicialización de BD en el inicio de cada request
- Manejo de errores de conexión con fallback
- Endpoint `/api/health` mejorado para verificar estado de conexión

### 2. ⚠️ Configurar Variables de Entorno en Vercel

**Opción A: Usar Supabase (Recomendado)**

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega estas variables:

```
DB_TYPE = postgresql
DATABASE_URL = postgresql://postgres:password@host:5432/postgres
NODE_ENV = production
```

Para obtener `DATABASE_URL`:
- Ve a [supabase.com](https://supabase.com)
- Abre tu proyecto
- Sección "Settings" → "Database" → copia la "Connection string"

**Opción B: Usar PostgreSQL en otra plataforma**

```
DB_TYPE = postgresql
PG_HOST = tu-host.com
PG_PORT = 5432
PG_DATABASE = tu-base-datos
PG_USER = usuario
PG_PASSWORD = contraseña
NODE_ENV = production
```

**Opción C: Usar SQLite (NO recomendado para producción)**

```
DB_TYPE = sqlite
SQLITE_PATH = ./data/miparqueo.db
NODE_ENV = production
```

## Pasos para Resolver el Error

### 1. Configurar Variables de Entorno
```bash
# En Vercel Dashboard
Proyecto → Settings → Environment Variables
Agregar todas las variables según tu opción (A, B o C)
```

### 2. Hacer Deploy nuevamente
```bash
git add .
git commit -m "Fix: Initialize database in serverless function"
git push
```

Vercel hará deploy automático.

### 3. Verificar que funciona
```bash
# En tu navegador o con curl:
https://tu-proyecto.vercel.app/api/health
```

Deberías ver una respuesta JSON similar a:
```json
{
  "status": "ok",
  "message": "Servidor funcionando",
  "dbStatus": "connected",
  "environment": "Vercel",
  "nodeEnv": "production"
}
```

## Troubleshooting

Si aún tienes error 500:

### A. Verificar logs de Vercel
1. Ve a Vercel Dashboard → Deployments
2. Selecciona el deployment más reciente
3. Abre "View Build Logs"
4. Busca mensajes de error

### B. Errores comunes

**"Error: Cannot find module"**
- Las dependencias no instalaron bien
- Solución: Verifica que `package.json` tenga todas las dependencias

**"Error de conexión a base de datos"**
- DATABASE_URL incorrecto
- Credenciales de BD inválidas
- Base de datos no accesible desde Vercel
- Solución: Verifica las credenciales en Supabase/PostgreSQL

**"SQLite: ENOENT, no such file or directory"**
- SQLite intenta crear archivo en servidor sin acceso a filesystem
- Solución: Usa PostgreSQL/Supabase (recomendado)

## Estructura Final Esperada

```
api/
  └─ index.js (✅ Actualizado - Inicializa BD)

backend/
  ├─ database.js (conexión a BD)
  └─ routes/ (rutas de API)

vercel.json (configuración de build)
package.json
```

## Próximos Pasos (Opcional)

1. **Mejorar seguridad**: Agregar validación de JWT en rutas
2. **Logging**: Agregar servicio de logs (LogRocket, Sentry, etc.)
3. **Monitoring**: Configurar alertas en Vercel para errores 5xx
4. **Rate limiting**: Agregar límite de requests por IP

---

**Estado**: ✅ Código actualizado | ⏳ Pendiente: Configurar variables en Vercel
