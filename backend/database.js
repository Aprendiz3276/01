import pg from 'pg';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;
const dbType = process.env.DB_TYPE || 'sqlite';

export class Database {
    constructor(connection) {
        this.connection = connection;
    }

    // Convertir placeholders de ? a $1, $2, etc. para PostgreSQL
    static convertSQLPlaceholders(sql, params) {
        if (dbType !== 'postgresql') return sql;
        
        let paramIndex = 1;
        return sql.replace(/\?/g, () => `$${paramIndex++}`);
    }

    async query(sql, params = []) {
        try {
            if (dbType === 'postgresql') {
                const convertedSql = Database.convertSQLPlaceholders(sql, params);
                const result = await this.connection.query(convertedSql, params);
                return result.rows;
            } else {
                return new Promise((resolve, reject) => {
                    this.connection.all(sql, params, (err, rows) => {
                        if (err) reject(err);
                        else resolve(rows || []);
                    });
                });
            }
        } catch (error) {
            console.error('Database query error:', error.message);
            throw error;
        }
    }

    async run(sql, params = []) {
        try {
            if (dbType === 'postgresql') {
                const convertedSql = Database.convertSQLPlaceholders(sql, params);
                const result = await this.connection.query(convertedSql, params);
                return result.rows[0] || { id: null };
            } else {
                return new Promise((resolve, reject) => {
                    this.connection.run(sql, params, function(err) {
                        if (err) reject(err);
                        else resolve({ id: this.lastID });
                    });
                });
            }
        } catch (error) {
            console.error('Database run error:', error.message);
            throw error;
        }
    }
}

async function initPostgreSQL() {
    // Soportar DATABASE_URL (Supabase) o credenciales individuales
    const connectionString = process.env.DATABASE_URL || 
        `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
    
    if (!connectionString || connectionString.includes('undefined')) {
        throw new Error('DATABASE_URL o credenciales de PostgreSQL no configuradas en variables de entorno');
    }

    const pool = new pg.Pool({
        connectionString: connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        max: 20
    });

    // Verificar conexión
    let client;
    try {
        client = await pool.connect();
        console.log('✅ Conexión a PostgreSQL exitosa');
    } catch (error) {
        console.error('❌ Error conectando a PostgreSQL:', error.message);
        throw error;
    }
    
    // Crear tablas
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS parking_lots (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                location VARCHAR(255) NOT NULL,
                total_spaces INTEGER NOT NULL,
                available_spaces INTEGER NOT NULL,
                price_per_hour DECIMAL(10,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                plate VARCHAR(20) UNIQUE NOT NULL,
                model VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id),
                parking_lot_id INTEGER NOT NULL REFERENCES parking_lots(id),
                vehicle_id INTEGER NOT NULL REFERENCES vehicles(id),
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP,
                status VARCHAR(50) DEFAULT 'active',
                total_cost DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('✅ Tablas creadas/verificadas exitosamente');
    } catch (error) {
        console.error('❌ Error creando tablas:', error.message);
        throw error;
    } finally {
        client.release();
    }

    return new Database(pool);
}

async function initSQLite() {
    return new Promise((resolve, reject) => {
        const dbPath = process.env.SQLITE_PATH || './data/miparqueo.db';
        const db = new sqlite3.Database(dbPath, async (err) => {
            if (err) reject(err);
            else {
                // Crear tablas
                const createTables = `
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        name TEXT NOT NULL,
                        role TEXT DEFAULT 'user',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS parking_lots (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        location TEXT NOT NULL,
                        total_spaces INTEGER NOT NULL,
                        available_spaces INTEGER NOT NULL,
                        price_per_hour REAL NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    );

                    CREATE TABLE IF NOT EXISTS vehicles (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        plate TEXT UNIQUE NOT NULL,
                        model TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id)
                    );

                    CREATE TABLE IF NOT EXISTS reservations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        parking_lot_id INTEGER NOT NULL,
                        vehicle_id INTEGER NOT NULL,
                        start_time DATETIME NOT NULL,
                        end_time DATETIME,
                        status TEXT DEFAULT 'active',
                        total_cost REAL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_id) REFERENCES users(id),
                        FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id),
                        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
                    );
                `;

                db.exec(createTables, (err) => {
                    if (err) reject(err);
                    else resolve(new Database(db));
                });
            }
        });
    });
}

export async function initializeDatabase() {
    if (dbType === 'postgresql') {
        console.log('Conectando a PostgreSQL...');
        db = await initPostgreSQL();
    } else {
        console.log('Conectando a SQLite...');
        db = await initSQLite();
    }
    return db;
}

export function getDatabase() {
    return db;
}
