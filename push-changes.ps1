$ErrorActionPreference = 'Continue'
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"
git add -A
git commit -m "Fix: Restructurar api/ para Vercel - importar desde api en lugar de backend"
git push origin main 2>&1
Write-Host "✅ Push completado"
