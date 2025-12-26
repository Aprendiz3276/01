import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware básico
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Health check SIMPLE (sin dependencias)
app.get('/api/health', (req, res) => {
    try {
        res.status(200).json({ 
            status: 'ok',
            message: 'Servidor funcionando',
            timestamp: new Date().toISOString(),
            environment: 'Vercel',
            nodeEnv: process.env.NODE_ENV,
            hasDbUrl: !!process.env.DATABASE_URL,
            dbType: process.env.DB_TYPE || 'no definido'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicializar BD después
let dbInitialized = false;
let initError = null;

const initializeApp = async () => {
    if (dbInitialized || initError) return;
    
    try {
        const { initializeDatabase } = await import('../backend/database.js');
        console.log('Inicializando base de datos...');
        await initializeDatabase();
        dbInitialized = true;
        console.log('BD inicializada correctamente');
        
        // Ahora cargar rutas
        const authRoutes = (await import('../backend/routes/auth.js')).default;
        const parkingRoutes = (await import('../backend/routes/parking.js')).default;
        const reservationRoutes = (await import('../backend/routes/reservations.js')).default;
        const userRoutes = (await import('../backend/routes/users.js')).default;

        app.use('/api/auth', authRoutes);
        app.use('/api/parking', parkingRoutes);
        app.use('/api/reservations', reservationRoutes);
        app.use('/api/users', userRoutes);
        
        console.log('Rutas cargadas correctamente');
    } catch (error) {
        console.error('Error en inicialización:', error.message);
        console.error('Stack:', error.stack);
        initError = error;
    }
};

// Middleware para inicializar en primer request
let initialized = false;
app.use(async (req, res, next) => {
    if (!initialized) {
        await initializeApp();
        initialized = true;
    }
    next();
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor',
        status: err.status || 500
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: true, 
        message: 'Ruta no encontrada' 
    });
});

export default app;
