#!/usr/bin/env node

// 🚀 SCRIPT DE INSTALACIÓN RÁPIDA PARA SUPABASE
// Ejecuta: node setup-supabase.js

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

function prompt(question) {
    return new Promise((resolve) => {
        rl.question(`${colors.cyan}? ${question}${colors.reset} `, (answer) => {
            resolve(answer);
        });
    });
}

function log(msg, type = 'info') {
    switch(type) {
        case 'success':
            console.log(`${colors.green}✅${colors.reset} ${msg}`);
            break;
        case 'error':
            console.log(`${colors.red}❌${colors.reset} ${msg}`);
            break;
        case 'warning':
            console.log(`${colors.yellow}⚠️ ${colors.reset}${msg}`);
            break;
        case 'title':
            console.log(`\n${colors.blue}${colors.bold}═══════════════════════════════════════${colors.reset}\n${colors.blue}${colors.bold}${msg}${colors.reset}\n${colors.blue}${colors.bold}═══════════════════════════════════════${colors.reset}\n`);
            break;
        default:
            console.log(`${colors.cyan}ℹ️ ${colors.reset}${msg}`);
    }
}

async function main() {
    log('ASISTENTE DE CONFIGURACIÓN SUPABASE', 'title');

    log('Este asistente te ayudará a configurar tu proyecto para Supabase', 'info');
    log('Necesitarás tus credenciales de Supabase', 'info');

    // Verificar si ya existe .env.local
    const envLocalPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envLocalPath)) {
        const response = await prompt('Archivo .env.local ya existe. ¿Deseas sobreescribirlo? (s/n)');
        if (response.toLowerCase() !== 's') {
            log('Operación cancelada', 'warning');
            rl.close();
            return;
        }
    }

    log('Obtén tus credenciales en: https://supabase.com → Tu Proyecto → Settings → Database', 'info');

    const password = await prompt('Ingresa tu PASSWORD de PostgreSQL (en Supabase)');
    const projectId = await prompt('Ingresa tu PROJECT_ID (de db.XXXXXXX.supabase.co)');
    const host = `db.${projectId}.supabase.co`;

    const databaseUrl = `postgresql://postgres:${password}@${host}:5432/postgres`;

    log('Configuración resumida:', 'info');
    log(`  Host: ${host}`, 'info');
    log(`  Project ID: ${projectId}`, 'info');
    log(`  Password: ${'*'.repeat(password.length)}`, 'info');

    const confirm = await prompt('¿Es correcta esta información? (s/n)');
    if (confirm.toLowerCase() !== 's') {
        log('Operación cancelada', 'warning');
        rl.close();
        return;
    }

    // Crear .env.local
    const envContent = `# Generado por setup-supabase.js el ${new Date().toLocaleString()}
# NO commits este archivo a Git

DB_TYPE=postgresql
DATABASE_URL=${databaseUrl}
PORT=3000
NODE_ENV=development
JWT_SECRET=8BzxYZ7g7wK6MqQTLe1iuAtsExiRXgAbOoykDetqoYVTx6DF77eh8jd6cbDC7IBYwwChpWbm3+3F0Uk1P1IIyQ==
REACT_APP_API_URL=http://localhost:3000
`;

    try {
        fs.writeFileSync(envLocalPath, envContent, 'utf-8');
        log(`.env.local creado exitosamente`, 'success');
    } catch (err) {
        log(`Error creando .env.local: ${err.message}`, 'error');
        rl.close();
        return;
    }

    log('Próximos pasos:', 'info');
    console.log(`
${colors.bold}1. Instala dependencias:${colors.reset}
   npm install

${colors.bold}2. Inicia el servidor:${colors.reset}
   npm start

${colors.bold}3. Verifica que funciona:${colors.reset}
   curl http://localhost:3000/api/health

${colors.bold}4. Para producción en Vercel:${colors.reset}
   - Push a GitHub
   - Ve a https://vercel.com
   - Importa tu repositorio
   - Agrega estas variables en Settings → Environment Variables:
     
     DB_TYPE = postgresql
     DATABASE_URL = ${databaseUrl}
     NODE_ENV = production
     JWT_SECRET = (el mismo de .env.local)
     REACT_APP_API_URL = https://tu-dominio.vercel.app

${colors.bold}5. Verifica la configuración:${colors.reset}
   node verify-supabase.js
`);

    rl.close();
}

main().catch((err) => {
    log(`Error: ${err.message}`, 'error');
    rl.close();
    process.exit(1);
});
