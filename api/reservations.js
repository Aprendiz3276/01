import { getDatabase } from './database.js';

export const reservationRoutes = {
    getByUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const db = getDatabase();

            const reservations = await db.query(
                `SELECT r.*, pl.name as parking_name, v.plate as vehicle_plate 
                 FROM reservations r
                 JOIN parking_lots pl ON r.parking_lot_id = pl.id
                 JOIN vehicles v ON r.vehicle_id = v.id
                 WHERE r.user_id = $1
                 ORDER BY r.created_at DESC`,
                [userId]
            );

            res.json(reservations);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    create: async (req, res) => {
        try {
            const { userId, parkingLotId, vehicleId, startTime, endTime } = req.body;
            const db = getDatabase();

            const parkingLots = await db.query(
                'SELECT price_per_hour FROM parking_lots WHERE id = $1',
                [parkingLotId]
            );

            if (parkingLots.length === 0) {
                return res.status(404).json({ error: 'Parqueadero no encontrado' });
            }

            const pricePerHour = parkingLots[0].price_per_hour;
            const hours = Math.ceil((new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60));
            const totalCost = hours * pricePerHour;

            await db.query(
                `INSERT INTO reservations (user_id, parking_lot_id, vehicle_id, start_time, end_time, total_cost, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [userId, parkingLotId, vehicleId, startTime, endTime, totalCost, 'active']
            );

            await db.query(
                'UPDATE parking_lots SET available_spaces = available_spaces - 1 WHERE id = $1',
                [parkingLotId]
            );

            res.status(201).json({ message: 'Reserva creada exitosamente', totalCost });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    cancel: async (req, res) => {
        try {
            const { id } = req.params;
            const db = getDatabase();

            const reservations = await db.query(
                'SELECT parking_lot_id FROM reservations WHERE id = $1',
                [id]
            );

            if (reservations.length === 0) {
                return res.status(404).json({ error: 'Reserva no encontrada' });
            }

            await db.query(
                'UPDATE reservations SET status = $1 WHERE id = $2',
                ['cancelled', id]
            );

            const parkingLotId = reservations[0].parking_lot_id;
            await db.query(
                'UPDATE parking_lots SET available_spaces = available_spaces + 1 WHERE id = $1',
                [parkingLotId]
            );

            res.json({ message: 'Reserva cancelada exitosamente' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
};
