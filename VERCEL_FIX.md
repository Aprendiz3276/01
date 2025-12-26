# Solución de Error 500 en Vercel

## Problema Identificado
El error `FUNCTION_INVOCATION_FAILED` ocurría porque Vercel no podía ejecutar correctamente la aplicación Express.

## Cambios Realizados

### 1. **Actualizado `api/index.js`** ✅
- Ahora contiene toda la configuración de Express necesaria
- Importa correctamente las rutas desde el backend
- Maneja errores de manera más robusta

### 2. **Actualizado `vercel.json`** ✅
- Configurado para usar `api/index.js` como punto de entrada
- Agregado timeout de 30 segundos
- Rutas configuradas correctamente

## Próximos Pasos - IMPORTANTE

### 1. Configura Variables de Entorno en Vercel:

1. Ve a tu proyecto en [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Agregue estas variables:

```
DB_TYPE=postgresql
PG_HOST=tu-host-postgres.com
PG_PORT=5432
PG_DATABASE=tu-base-datos
PG_USER=tu-usuario
PG_PASSWORD=tu-contraseña-segura
JWT_SECRET=un-string-secreto-muy-largo
NODE_ENV=production
```

### 2. Valida tu Base de Datos:
- Asegúrate que tu PostgreSQL sea accesible desde Vercel (sin restricciones de IP)
- O migra a una base de datos cloud (Supabase, Railway, Render)

### 3. Deploy:
```bash
git add .
git commit -m "Fix: Configuración serverless para Vercel"
git push
```

Vercel automáticamente redesplegará con los cambios.

## Alternativa: Usar Supabase (Recomendado)

Supabase es ideal para Vercel:

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Copia la `DATABASE_URL`
3. En Vercel, agregue:
```
DATABASE_URL=postgresql://user:password@host:5432/database
```

## Verifica el Despliegue

Después de hacer push, ejecuta:
```bash
curl https://tu-dominio-vercel.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Servidor funcionando",
  "environment": "Vercel",
  "nodeEnv": "production"
}
```

## Si aún hay problemas:

1. **Ve a Vercel** → Tu proyecto → **Deployments**
2. Haz clic en el deploy que falló
3. Ve a **Logs** para ver el error exacto
4. Comparte ese error conmigo para diagnosticar

