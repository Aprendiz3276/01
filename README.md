# MiParqueo - Sistema Urbano de Parqueaderos

## 📋 Descripción
Aplicación web completa para gestión de reservas de parqueaderos con sistema de autenticación que detecta automáticamente si el usuario es cliente o administrador.

## 🎯 Características principales

### Panel de Usuario
- **Mis Reservas**: Ver reservas activas en tiempo real
- **Historial**: Registro completo de todas las reservaciones
- **Mis vehículos**: Gestión de múltiples vehículos
- **Perfil**: Información personal y estadísticas de uso

### Panel de Administrador
- **Dashboard**: Estadísticas en tiempo real (usuarios, ingresos, ocupación)
- **Gestión de Parqueaderos**: CRUD completo de parqueaderos
- **Gestión de Usuarios**: Supervisión de clientes registrados
- **Reservas**: Control total de todas las reservaciones
- **Reportes**: Análisis y generación de reportes

## 🔐 Credenciales de Prueba

### Usuario Regular
- **Correo**: usuario@example.com
- **Contraseña**: 1234

### Administrador
- **Correo**: admin@example.com
- **Contraseña**: 1234

## 🎨 Diseño Visual
- **Colores principales**: Negro (#000000) y Amarillo (#FFD600)
- **Tipografía**: Mayúsculas y tracking amplios para efecto urbano
- **Bordes**: Diseño de bordes gruesos sin bordes redondeados
- **Sombras**: Efecto de desplazamiento en dos dimensiones

## 📁 Estructura de Archivos

```
APP parqueadero LAguarda/
├── index.html                 # Página principal con login y dashboards
├── css/
│   └── styles.css            # Estilos personalizados
├── js/
│   └── app.js                # Lógica de autenticación y navegación
└── README.md                 # Este archivo
```

## 🚀 Despliegue en Vercel

Para desplegar esta aplicación en Vercel con GitHub, sigue la guía completa en [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

### Resumen rápido:
1. Crea un repositorio en GitHub
2. Conecta con Vercel
3. Configura variables de entorno
4. ¡Listo! Tu app estará online

## 🚀 Cómo usar (Desarrollo Local)

### 1. Abrir la aplicación
- Abre `index.html` en tu navegador web

### 2. Login
- Ingresa las credenciales de prueba
- El sistema detecta automáticamente si eres usuario o admin
- Se carga el dashboard correspondiente

### 3. Navegar
- **Usuario**: Usa las pestañas para ver reservas, historial, vehículos y perfil
- **Admin**: Usa las pestañas para ver estadísticas, gestionar parqueaderos, usuarios y crear reportes

### 4. Cerrar sesión
- Haz clic en el botón "Cerrar sesión" en la esquina superior derecha

## 💻 Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados y Tailwind CSS
- **JavaScript (Vanilla)**: Lógica de autenticación y navegación
- **Tailwind CSS**: Framework de utilidades

## 🔧 Funcionalidades técnicas

### Sistema de Autenticación
- Validación de credenciales contra base de datos simulada
- Detección automática de rol (usuario/admin)
- Gestión de estado de sesión
- Cierre de sesión seguro

### Navegación
- Sistema de pestañas funcional
- Cambio dinámico de contenido
- Ocultar/mostrar dashboards según rol
- Historial de navegación con JavaScript

### Responsive Design
- Interfaz adaptable a diferentes tamaños de pantalla
- Mobile-first approach
- Menús colapsables en dispositivos pequeños

## 📝 Notas importantes

- Las credenciales están hardcodeadas para demostración
- Los datos mostrados son simulados
- No hay conexión a base de datos real
- El estado se pierde al recargar la página

## 🔄 Próximas mejoras

- [ ] Integración con base de datos real
- [ ] Autenticación con JWT
- [ ] Gráficos interactivos avanzados
- [ ] Búsqueda y filtrado avanzado
- [ ] Notificaciones en tiempo real
- [ ] Exportar reportes en PDF
- [ ] Dark mode
- [ ] Múltiples idiomas

## ⚠️ Consideraciones de seguridad

**Para producción:**
- Implementar autenticación segura con backend
- Usar HTTPS
- Encriptar contraseñas
- Implementar CSRF protection
- Validar datos en servidor
- Usar tokens JWT o similares

## 📞 Soporte

Para consultas o reportar errores, contacta al equipo de desarrollo de MiParqueo.

---

**MiParqueo © 2025** - Sistema Urbano de Parqueaderos
