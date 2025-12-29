#!/usr/bin/env node

// 🔍 SCRIPT DE VERIFICACIÓN SUPABASE
// Ejecuta: node verify-supabase.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores para consola
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️ ${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️ ${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}\n${colors.blue}${msg}${colors.reset}\n${colors.blue}═══════════════════════════════════════${colors.reset}\n`)
};

let passCount = 0;
let warnCount = 0;
let errorCount = 0;

function checkFile(filePath, description) {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        log.success(`${description} existe`);
        passCount++;
        return true;
    } else {
        log.error(`${description} NO existe: ${filePath}`);
        errorCount++;
        return false;
    }
}

function checkEnvFile(filePath, required = false) {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
        if (required) {
            log.error(`${filePath} NO existe`);
            errorCount++;
        } else {
            log.warning(`${filePath} NO existe (opcional)`);
            warnCount++;
        }
        return false;
    }

    try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Verificar DATABASE_URL
        if (content.includes('DATABASE_URL=') && !content.includes('DATABASE_URL=postgresql://postgres:YOUR')) {
            log.success(`${filePath} contiene DATABASE_URL válida`);
            passCount++;
        } else if (content.includes('DATABASE_URL=') && content.includes('YOUR')) {
            log.warning(`${filePath}: DATABASE_URL es un placeholder (reemplaza con tu contraseña)`);
            warnCount++;
        }
        
        // Verificar DB_TYPE
        if (content.includes('DB_TYPE=postgresql')) {
            log.success(`${filePath}: DB_TYPE configurado a postgresql ✓`);
            passCount++;
        } else {
            log.warning(`${filePath}: DB_TYPE no está configurado a postgresql`);
            warnCount++;
        }
        
        return true;
    } catch (err) {
        log.error(`Error leyendo ${filePath}: ${err.message}`);
        errorCount++;
        return false;
    }
}

function checkDatabaseFile() {
    const filePath = path.join(__dirname, 'backend/database.js');
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        let checks = {
            'convertSQLPlaceholders': false,
            'SSL config': false,
            'connectionTimeoutMillis': false,
            'error handling': false
        };

        if (content.includes('convertSQLPlaceholders')) {
            checks['convertSQLPlaceholders'] = true;
            log.success(`database.js: Conversión de placeholders SQL implementada`);
            passCount++;
        }
        
        if (content.includes('rejectUnauthorized: false')) {
            checks['SSL config'] = true;
            log.success(`database.js: SSL configurado para Supabase`);
            passCount++;
        }
        
        if (content.includes('connectionTimeoutMillis')) {
            checks['connectionTimeoutMillis'] = true;
            log.success(`database.js: Timeouts configurados`);
            passCount++;
        }
        
        if (content.includes('console.error')) {
            checks['error handling'] = true;
            log.success(`database.js: Manejo de errores mejorado`);
            passCount++;
        }

        for (const [check, found] of Object.entries(checks)) {
            if (!found) {
                log.warning(`database.js: ${check} no encontrado`);
                warnCount++;
            }
        }
    } catch (err) {
        log.error(`Error verificando database.js: ${err.message}`);
        errorCount++;
    }
}

function checkRouteFiles() {
    const routes = [
        'backend/routes/auth.js',
        'backend/routes/parking.js',
        'backend/routes/reservations.js',
        'backend/routes/users.js'
    ];

    routes.forEach(route => {
        const filePath = path.join(__dirname, route);
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            
            // Verificar que usa $1, $2 en lugar de ?
            const hasPostgresPlaceholders = /\$\d+/g.test(content);
            const hasOldPlaceholders = content.match(/VALUES\s*\([?]/g) || 
                                     content.match(/WHERE\s+[^=]+=\s*\?/g);
            
            if (hasPostgresPlaceholders && !hasOldPlaceholders) {
                log.success(`${route}: Usa placeholders PostgreSQL correctamente`);
                passCount++;
            } else if (hasOldPlaceholders) {
                log.error(`${route}: Todavía usa placeholders de SQLite (?)`);
                errorCount++;
            }
        } catch (err) {
            log.error(`Error verificando ${route}: ${err.message}`);
            errorCount++;
        }
    });
}

function main() {
    log.title('🔍 VERIFICACIÓN DE CONFIGURACIÓN SUPABASE');

    log.info('Verificando estructura de archivos...\n');
    checkFile('backend/database.js', 'database.js');
    checkFile('backend/routes/auth.js', 'auth.js');
    checkFile('backend/routes/parking.js', 'parking.js');
    checkFile('backend/routes/reservations.js', 'reservations.js');
    checkFile('backend/routes/users.js', 'users.js');
    checkFile('package.json', 'package.json');
    checkFile('server.js', 'server.js');

    log.title('📋 VERIFICANDO ARCHIVOS DE CONFIGURACIÓN');
    
    checkEnvFile('.env', false);
    checkEnvFile('.env.production', false);
    checkEnvFile('.env.local', false);

    log.title('⚙️ VERIFICANDO CÓDIGO');
    
    checkDatabaseFile();
    checkRouteFiles();

    log.title('📊 RESULTADO FINAL');
    
    console.log(`${colors.green}✅ Pasadas: ${passCount}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Advertencias: ${warnCount}${colors.reset}`);
    console.log(`${colors.red}❌ Errores: ${errorCount}${colors.reset}`);

    if (errorCount === 0 && warnCount === 0) {
        log.success('\n¡TODO ESTÁ CORRECTO! Tu proyecto está listo para Supabase. 🎉\n');
        process.exit(0);
    } else if (errorCount === 0) {
        log.warning('\nProyecto está configurado, pero revisa las advertencias. ⚠️\n');
        process.exit(0);
    } else {
        log.error('\nExisten errores que deben corregirse antes de usar Supabase. ❌\n');
        process.exit(1);
    }
}

main();
