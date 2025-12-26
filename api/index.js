import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from '../backend/routes/auth.js';
import parkingRoutes from '../backend/routes/parking.js';
import reservationRoutes from '../backend/routes/reservations.js';
import userRoutes from '../backend/routes/users.js';
import { initializeDatabase } from '../backend/database.js';

dotenv.config();

const app = express();

// Flag para rastrear inicialización
let dbInitialized = false;
let initError = null;
let initPromise = null;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Inicializar base de datos (una sola vez)
const initDB = async () => {
    if (dbInitialized || initError || initPromise) {
        return;
    }
    
    initPromise = (async () => {
        try {
            console.log('Iniciando base de datos...');
            await initializeDatabase();
            dbInitialized = true;
            console.log('Base de datos inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando base de datos:', error.message);
            initError = error;
        }
    })();
    
    await initPromise;
};

// Middleware de inicialización
app.use(async (req, res, next) => {
    await initDB();
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: dbInitialized ? 'ok' : (initError ? 'error' : 'initializing'),
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString(),
        environment: 'Vercel',
        nodeEnv: process.env.NODE_ENV,
        dbStatus: dbInitialized ? 'connected' : (initError ? 'failed' : 'connecting'),
        error: initError ? initError.message : null
    });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: true,
        message: err.message || 'Error interno del servidor',
        status: err.status || 500,
        timestamp: new Date().toISOString()
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
