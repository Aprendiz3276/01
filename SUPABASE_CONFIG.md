# 🔧 GUÍA COMPLETA DE CONFIGURACIÓN SUPABASE

## ✅ Cambios Realizados en el Proyecto

El proyecto ha sido actualizado para ser totalmente compatible con Supabase (PostgreSQL). Los siguientes cambios se han realizado:

### 1. **Base de Datos (backend/database.js)**
- ✅ Agregada conversión automática de placeholders de `?` a `$1, $2, $3...` (estándar PostgreSQL)
- ✅ Mejorado manejo de errores de conexión
- ✅ Agregado soporte para timeouts y reintentos
- ✅ Validación de variables de entorno

### 2. **Rutas API (backend/routes/)**
- ✅ **auth.js**: Actualizado para usar placeholders PostgreSQL
- ✅ **parking.js**: Actualizado para usar placeholders PostgreSQL
- ✅ **reservations.js**: Actualizado para usar placeholders PostgreSQL
- ✅ **users.js**: Actualizado para usar placeholders PostgreSQL

### 3. **Archivos de Configuración**
- ✅ **.env**: Actualizado con configuración por defecto para Supabase
- ✅ **.env.production**: Optimizado para Vercel + Supabase
- ✅ **vercel.json**: Configurado correctamente para Vercel
- ✅ **.env.local.example**: Creado con instrucciones claras

---

## 🚀 CONFIGURACIÓN PASO A PASO

### **Opción 1: Desarrollo Local con Supabase**

#### 1. Obtén tus credenciales de Supabase
```
1. Ve a https://supabase.com
2. Inicia sesión o crea una cuenta
3. Crea un nuevo proyecto (Project)
4. Espera a que se cree (puede tomar unos minutos)
5. Ve a Settings → Database → Connection Pooling
6. Copia la DATABASE_URL (se ve así):
   postgresql://postgres:your_password@db.xxxxxx.supabase.co:5432/postgres
```

#### 2. Crea archivo .env.local
```bash
# En la raíz del proyecto, crea un archivo llamado .env.local
# (O copia desde .env.local.example)

cp .env.local.example .env.local
```

#### 3. Edita .env.local
```
DB_TYPE=postgresql
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_ID.supabase.co:5432/postgres
PORT=3000
NODE_ENV=development
JWT_SECRET=8BzxYZ7g7wK6MqQTLe1iuAtsExiRXgAbOoykDetqoYVTx6DF77eh8jd6cbDC7IBYwwChpWbm3+3F0Uk1P1IIyQ==
REACT_APP_API_URL=http://localhost:3000
```

#### 4. Instala dependencias
```bash
npm install
```

#### 5. Inicia el servidor
```bash
npm start
```

---

### **Opción 2: Producción en Vercel + Supabase**

#### 1. Crea un proyecto en Supabase
- Sigue los pasos anteriores (1-6)

#### 2. Conecta Vercel a GitHub
```
1. Ve a https://vercel.com
2. Haz login o crea cuenta
3. Selecciona "Import Project"
4. Selecciona tu repositorio
5. Haz clic en "Import"
```

#### 3. Agrega Environment Variables en Vercel
```
1. En Vercel Dashboard → Tu Proyecto → Settings
2. Selecciona "Environment Variables"
3. Agrega cada variable (en TODAS las instancias):

   DB_TYPE = postgresql
   DATABASE_URL = postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres
   NODE_ENV = production
   JWT_SECRET = 8BzxYZ7g7wK6MqQTLe1iuAtsExiRXgAbOoykDetqoYVTx6DF77eh8jd6cbDC7IBYwwChpWbm3+3F0Uk1P1IIyQ==
   REACT_APP_API_URL = https://tu-dominio.vercel.app
```

#### 4. Haz deploy
```bash
git push
# O manualmente desde Vercel Dashboard
```

---

## 🔐 NOTAS DE SEGURIDAD

### ⚠️ IMPORTANTE: Credenciales Seguras

1. **NUNCA commits .env.local a Git**
   - Está en .gitignore
   - Solo en desarrollo local

2. **Usa credenciales fuertes en Supabase**
   - Ve a Supabase → Settings → Database
   - Puedes cambiar la contraseña de postgres

3. **JWT_SECRET**
   - Genera uno diferente para producción
   - Usa: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

4. **Variables en Vercel**
   - Son encriptadas
   - Solo accesibles durante build/runtime
   - Nunca se exponen en el cliente

---

## 🧪 VERIFICACIÓN

### Verificar que todo funciona

```bash
# 1. Verifica que el servidor inicia
npm start
# Deberías ver: ✅ Servidor ejecutándose en http://localhost:3000
#              ✅ Base de datos inicializada

# 2. Prueba el health check
curl http://localhost:3000/api/health
# Deberías ver: {"status":"ok","message":"Servidor funcionando",...}

# 3. Prueba login (en terminal o Postman)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 🐛 RESOLUCIÓN DE PROBLEMAS

### Error: "DATABASE_URL no está configurada"
```
✓ Verifica que .env.local existe en la raíz
✓ Verifica que DATABASE_URL está en .env.local
✓ Reinicia el servidor: npm start
```

### Error: "Error conectando a PostgreSQL"
```
✓ Verifica tu DATABASE_URL es correcta
✓ Verifica tu contraseña en Supabase
✓ Verifica que tu proyecto en Supabase está activo
✓ Espera 30 segundos y reinteneta
```

### Error: "Tablas no encontradas"
```
✓ Las tablas se crean automáticamente en el primer inicio
✓ Verifica la consola para errores
✓ Si persiste, ve a Supabase Dashboard → SQL Editor
  y ejecuta manualmente las queries de backend/database.js
```

### Error en Vercel: "API no responde"
```
✓ Verifica que DATABASE_URL está en Vercel Environment Variables
✓ Verifica que NODE_ENV=production en Vercel
✓ Revisa los logs en Vercel Dashboard → Deployments → Logs
```

---

## 📚 RECURSOS ÚTILES

- **Documentación Supabase**: https://supabase.com/docs
- **Documentación Vercel**: https://vercel.com/docs
- **PostgreSQL SQL**: https://www.postgresql.org/docs/
- **Node.js pg**: https://node-postgres.com/

---

## ✨ SIGUIENTES PASOS

1. **Habilita autenticación en Supabase** (opcional)
   - Settings → Authentication → Providers

2. **Agrega CORS si accedes desde otro dominio**
   - Verifica la configuración en server.js

3. **Implementa bcrypt para contraseñas**
   - `npm install bcrypt`
   - Ver comentarios en backend/routes/auth.js

4. **Agrega validaciones de datos**
   - Instala joi o yup para validación

5. **Implementa JWT tokens**
   - Para autenticación más segura
   - Ver comentarios en server.js

---

**Actualizado**: 29 de diciembre de 2025
**Versión**: 1.0 (Compatible con Supabase)
