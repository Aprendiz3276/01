import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './backend/routes/auth.js';
import parkingRoutes from './backend/routes/parking.js';
import reservationRoutes from './backend/routes/reservations.js';
import userRoutes from './backend/routes/users.js';
import { initializeDatabase } from './backend/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Archivos estáticos
const staticPath = join(__dirname);
app.use(express.static(staticPath));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV
    });
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/parking', parkingRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/users', userRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
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

// Solo iniciar servidor en desarrollo local
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    initializeDatabase().then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`✅ Base de datos inicializada`);
        });
    }).catch((err) => {
        console.error('❌ Error al inicializar base de datos:', err);
        process.exit(1);
    });
}

export default app;
