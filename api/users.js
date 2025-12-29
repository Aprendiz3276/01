import { getDatabase } from './database.js';

export const userRoutes = {
    getProfile: async (req, res) => {
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
    },

    getVehicles: async (req, res) => {
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
    },

    addVehicle: async (req, res) => {
        try {
            const { userId } = req.params;
            const { plate, model } = req.body;
            const db = getDatabase();

            await db.query(
                'INSERT INTO vehicles (user_id, plate, model) VALUES ($1, $2, $3)',
                [userId, plate, model]
            );

            res.status(201).json({ message: 'Vehículo agregado exitosamente' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    deleteVehicle: async (req, res) => {
        try {
            const { vehicleId } = req.params;
            const db = getDatabase();

            await db.query('DELETE FROM vehicles WHERE id = $1', [vehicleId]);

            res.json({ message: 'Vehículo eliminado exitosamente' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};
