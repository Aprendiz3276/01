# Configuración de Supabase para Vercel

## Paso 1: Crear Cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Click en **Sign Up** (Registrarse)
3. Inicia sesión con GitHub (recomendado)
4. Completa tu perfil

## Paso 2: Crear un Nuevo Proyecto

1. Click en **New Project** (Nuevo Proyecto)
2. **Organization:** Selecciona o crea una
3. **Project Name:** `miparqueo` (o el nombre que prefieras)
4. **Database Password:** Crea una contraseña fuerte (¡no olvides!)
5. **Region:** Selecciona la más cercana a tu ubicación (ej: `sa-santiago` para Chile)
6. Click en **Create New Project**

⏳ Espera 2-3 minutos a que se cree el proyecto...

## Paso 3: Obtener la DATABASE_URL

1. Una vez creado, ve a **Project Settings** (esquina inferior izquierda)
2. Haz clic en **Database**
3. Copia la cadena `URI` (parece: `postgresql://postgres:...`)
4. **IMPORTANTE:** En la URL, cambia `[YOUR-PASSWORD]` por la contraseña que creaste

**La URL debería verse así:**
```
postgresql://postgres:TU_CONTRASEÑA@db.xxxxx.supabase.co:5432/postgres
```

## Paso 4: Actualizar Variables en Vercel

1. Ve a [vercel.com](https://vercel.com) → Tu proyecto
2. **Settings** → **Environment Variables**
3. Agregue nueva variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Pega la URL de Supabase
4. Click en **Save**

## Paso 5: Hacer Deploy

```bash
git add .
git commit -m "Configurar Supabase para Vercel"
git push
```

Vercel redesplegará automáticamente.

## Paso 6: Verificar Funcionamiento

Una vez desplegado, ejecuta en tu terminal:

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

## Acceder a Supabase Admin

Para ver/editar datos en Supabase:

1. Ve a tu proyecto en Supabase
2. **SQL Editor** (lado izquierdo) → Ejecuta consultas
3. **Table Editor** → Visualiza datos en tablas

### Crear datos de prueba (Opcional):

Copia esto en Supabase **SQL Editor**:

```sql
-- Insertar usuarios de prueba
INSERT INTO users (email, password, name, role) VALUES 
('usuario@example.com', '1234', 'Juan Pérez', 'user'),
('admin@example.com', '1234', 'Administrador', 'admin');

-- Insertar parqueaderos de prueba
INSERT INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) VALUES
('Centro Comercial', 'Avenida Principal 123', 50, 50, 2.50),
('Parque la Paz', 'Carrera 5 # 45-60', 30, 30, 1.75),
('Terminal de Buses', 'Calle 10 # 20-30', 100, 100, 1.50),
('Centro Cívico', 'Avenida Libertad 456', 75, 75, 2.00);
```

## Troubleshooting

### Error: "Connection refused"
- Verifica que la DATABASE_URL esté correcta en Vercel
- Asegúrate que la contraseña no tenga caracteres especiales sin escapar

### Error: "relation does not exist"
- Las tablas no se crearon en Supabase
- Ve a Supabase SQL Editor y crea las tablas manualmente

### Todo funciona localmente pero no en Vercel
- Verifica que `.env` NO esté en git (debe estar en `.gitignore`)
- Confirma que la DATABASE_URL está en las variables de Vercel

