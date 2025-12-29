# ⚡ INICIO RÁPIDO - SUPABASE

## 🎯 3 Pasos para Empezar

### 1️⃣ Configurar Supabase (2 minutos)

```bash
# Opción A: Asistente automático (RECOMENDADO)
node setup-supabase.js

# Opción B: Manual
# - Ve a https://supabase.com
# - Crea un nuevo proyecto
# - Copia la DATABASE_URL de Settings → Database
# - Edita .env.local y reemplaza tu contraseña
```

### 2️⃣ Instalar y Correr (1 minuto)

```bash
npm install
npm start
```

### 3️⃣ Verificar que Funciona (30 segundos)

```bash
# En otra terminal:
curl http://localhost:3000/api/health

# Deberías ver:
# {"status":"ok","message":"Servidor funcionando",...}
```

---

## 📋 Verificación (Opcional)

```bash
node verify-supabase.js
```

---

## 🚀 Desplegar en Vercel

```bash
git push origin main
# Vercel desplegará automáticamente
# Asegúrate de agregar estas env vars en Vercel:
#   DB_TYPE=postgresql
#   DATABASE_URL=postgresql://...
#   NODE_ENV=production
#   REACT_APP_API_URL=https://tu-dominio.vercel.app
```

---

## ❓ ¿Problemas?

- **Error de conexión**: Verifica tu DATABASE_URL en .env.local
- **Tablas no encontradas**: Son creadas automáticamente al iniciar
- **Error en Vercel**: Revisa los logs en Vercel Dashboard

**Documentación completa**: Ver `SUPABASE_CONFIG.md`

---

**¡Listo para Supabase! 🎉**
