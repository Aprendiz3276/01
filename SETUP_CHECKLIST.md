# ✅ CHECKLIST - Configuración Supabase + Vercel

## 📋 Pasos a Seguir

### 1️⃣ Crear Proyecto en Supabase
- [ ] Ve a https://supabase.com
- [ ] Haz clic en **Sign Up**
- [ ] Inicia sesión con GitHub
- [ ] Haz clic en **New Project**
- [ ] **Nombre:** `miparqueo`
- [ ] **Password:** Crea una contraseña segura (¡GUÁRDALA!)
- [ ] **Region:** Selecciona la más cercana

### 2️⃣ Obtener DATABASE_URL
- [ ] Espera a que Supabase termine (2-3 minutos)
- [ ] Ve a **Project Settings** (abajo a la izquierda)
- [ ] Click en **Database**
- [ ] Copia la URL que dice `URI`
- [ ] Reemplaza `[YOUR-PASSWORD]` con tu contraseña
- [ ] Copia la URL completa

**Ejemplo de URL:**
```
postgresql://postgres:micontraseña123@db.xxxxxx.supabase.co:5432/postgres
```

### 3️⃣ Configurar en Vercel
- [ ] Ve a https://vercel.com
- [ ] Abre tu proyecto **parquedero-1-pjec**
- [ ] Ve a **Settings**
- [ ] Click en **Environment Variables**
- [ ] Haz clic en **Add New**
  - **Key:** `DATABASE_URL`
  - **Value:** Pega la URL de Supabase
- [ ] Click en **Save**

### 4️⃣ (Opcional) Crear Datos de Prueba
- [ ] Ve a tu proyecto en Supabase
- [ ] Click en **SQL Editor**
- [ ] Pega este código:

```sql
-- Usuarios
INSERT INTO users (email, password, name, role) VALUES 
('usuario@example.com', '1234', 'Juan Pérez', 'user'),
('admin@example.com', '1234', 'Administrador', 'admin');

-- Parqueaderos
INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) VALUES
('Centro Comercial', 'Avenida Principal 123', 50, 50, 2.50),
('Parque la Paz', 'Carrera 5 # 45-60', 30, 30, 1.75);
```

- [ ] Click en **Run** (botón azul)

### 5️⃣ Deploy a Vercel
En tu terminal local:

```bash
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"
git add .
git commit -m "Configurar Supabase para Vercel"
git push
```

### 6️⃣ Verificar que Funciona
- [ ] Espera a que Vercel termine el deploy (2-5 minutos)
- [ ] Ve a tu URL de Vercel y abre: `/api/health`
- [ ] Deberías ver: `{"status":"ok", ...}`

## 🆘 Si Algo Falla

1. **Revisa los logs en Vercel:**
   - Vercel → Tu proyecto → **Deployments**
   - Haz clic en el deploy más reciente
   - Ve a **Logs**

2. **Verifica Database_URL:**
   - Supabase → Project Settings → Database
   - Copia de nuevo la URI
   - En Vercel, actualiza la variable

3. **Si las tablas no existen:**
   - Ve a Supabase → **SQL Editor**
   - Ejecuta el SQL para crear las tablas manualmente

## 📚 Documentación Adicional

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Guía detallada
- [VERCEL_FIX.md](VERCEL_FIX.md) - Problemas de Vercel
- [.env.production](.env.production) - Variables de entorno

