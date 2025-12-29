import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authRoutes } from './auth.js';
import { parkingRoutes } from './parking.js';
import { reservationRoutes } from './reservations.js';
import { userRoutes } from './users.js';
import { initializeDatabase } from './database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear aplicación Express
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoding({ limit: '50mb', extended: true }));

// Inicializar base de datos
await initializeDatabase();

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        message: 'Servidor funcionando',
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV,
        db_type: process.env.DB_TYPE || 'not set'
    });
});

// Rutas Auth
app.post('/api/auth/login', authRoutes.login);
app.post('/api/auth/register', authRoutes.register);

// Rutas Parking
app.get('/api/parking', parkingRoutes.getAll);
app.post('/api/parking', parkingRoutes.create);
app.put('/api/parking/:id', parkingRoutes.update);
app.delete('/api/parking/:id', parkingRoutes.delete);

// Rutas Reservations
app.get('/api/reservations/user/:userId', reservationRoutes.getByUser);
app.post('/api/reservations', reservationRoutes.create);
app.put('/api/reservations/:id/cancel', reservationRoutes.cancel);

// Rutas Users
app.get('/api/users/:id', userRoutes.getProfile);
app.get('/api/users/:userId/vehicles', userRoutes.getVehicles);
app.post('/api/users/:userId/vehicles', userRoutes.addVehicle);
app.delete('/api/users/:vehicleId', userRoutes.deleteVehicle);

// Archivos estáticos (raíz del proyecto)
const staticPath = join(__dirname, '..');
app.use(express.static(staticPath));

// 404 fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Exportar como handler serverless de Vercel
export default app;

