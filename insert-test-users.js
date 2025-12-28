import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = './data/miparqueo.db';

const db = new sqlite3.Database(dbPath, async (err) => {
    if (err) {
        console.error('Error al conectar a la BD:', err);
        process.exit(1);
    }

    // Usuarios de prueba
    const testUsers = [
        {
            email: 'admin@miparqueo.com',
            password: 'admin123',
            name: 'Administrador',
            role: 'admin'
        },
        {
            email: 'usuario@miparqueo.com',
            password: 'usuario123',
            name: 'Usuario Prueba',
            role: 'user'
        },
        {
            email: 'test@example.com',
            password: 'test123',
            name: 'Test User',
            role: 'user'
        }
    ];

    // Parqueaderos de prueba
    const testParking = [
        {
            name: 'Parqueadero Centro',
            location: 'Calle 50 #15-20',
            total_spaces: 150,
            available_spaces: 120,
            price_per_hour: 5000
        },
        {
            name: 'Parqueadero Norte',
            location: 'Carrera 7 #100-50',
            total_spaces: 200,
            available_spaces: 85,
            price_per_hour: 4000
        },
        {
            name: 'Parqueadero Mall',
            location: 'Avenida Boyacá #120-10',
            total_spaces: 500,
            available_spaces: 350,
            price_per_hour: 3500
        }
    ];

    try {
        // Insertar usuarios
        for (const user of testUsers) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO users (email, password, name, role) 
                     VALUES (?, ?, ?, ?)`,
                    [user.email, user.password, user.name, user.role],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        console.log('✅ Usuarios de prueba insertados:');
        testUsers.forEach(u => {
            console.log(`   - Email: ${u.email} | Contraseña: ${u.password} | Rol: ${u.role}`);
        });

        // Insertar parqueaderos
        for (const parking of testParking) {
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT OR IGNORE INTO parking_lots (name, location, total_spaces, available_spaces, price_per_hour) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [parking.name, parking.location, parking.total_spaces, parking.available_spaces, parking.price_per_hour],
                    (err) => {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        console.log('\n✅ Parqueaderos de prueba insertados:');
        testParking.forEach(p => {
            console.log(`   - ${p.name}: ${p.available_spaces}/${p.total_spaces} espacios`);
        });

        console.log('\n✅ Datos de prueba cargados exitosamente');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
});
