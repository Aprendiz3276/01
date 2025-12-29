import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();

// Obtener perfil de usuario
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = getDatabase();

        const users = await db.query(
            'SELECT id, email, name, role FROM users WHERE id = $1',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Obtener vehículos del usuario
router.get('/:userId/vehicles', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = getDatabase();

        const vehicles = await db.query(
            'SELECT * FROM vehicles WHERE user_id = $1',
            [userId]
        );

        res.json(vehicles);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar vehículo
router.post('/:userId/vehicles', async (req, res) => {
    try {
        const { userId } = req.params;
        const { plate, model } = req.body;
        const db = getDatabase();

        await db.run(
            'INSERT INTO vehicles (user_id, plate, model) VALUES ($1, $2, $3)',
            [userId, plate, model]
        );

        res.status(201).json({ message: 'Vehículo agregado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Actualizar perfil
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const db = getDatabase();

        await db.run(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3',
            [name, email, id]
        );

        res.json({ message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

export default router;
