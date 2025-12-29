import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = getDatabase();

        if (!db) {
            return res.status(503).json({ 
                error: 'Base de datos no disponible',
                message: 'El servidor está inicializando. Intenta de nuevo en unos segundos.'
            });
        }

        const users = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = users[0];
        
        // En producción, usar bcrypt para comparar contraseñas
        if (user.password !== password) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Registro
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const db = getDatabase();

        // Validaciones
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Campos requeridos' });
        }

        await db.run(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
            [email, password, name, 'user']
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en registro:', error);
        if (error.message.includes('UNIQUE')) {
            res.status(400).json({ error: 'El email ya está registrado' });
        } else {
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
});

export default router;
