# Script de ejemplo para usar el servicio de anonimización
# Ejecuta: powershell -ExecutionPolicy Bypass -File ejemplo-uso.ps1

Write-Host "=== Servicio de Anonimización Demo ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el servicio esté funcionando
Write-Host "1. Verificando salud del servicio..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health"
    Write-Host "   ✓ Servicio funcionando correctamente" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ✗ Error: El servicio no está corriendo en el puerto 3001" -ForegroundColor Red
    Write-Host "   Por favor, inicia el servicio ejecutando: node src/demo.js" -ForegroundColor Yellow
    exit 1
}

# 2. Ejemplo: Anonimizar un mensaje
Write-Host "2. Anonimizando un mensaje..." -ForegroundColor Yellow
$mensajeOriginal = "oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897"

$bodyAnonimizar = @{
    message = $mensajeOriginal
} | ConvertTo-Json -Compress

Write-Host "   Mensaje original:" -ForegroundColor Gray
Write-Host "   $mensajeOriginal" -ForegroundColor White
Write-Host ""

try {
    $resultadoAnonimizado = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/anonymize" -ContentType "application/json" -Body $bodyAnonimizar
    Write-Host "   Mensaje anonimizado:" -ForegroundColor Gray
    Write-Host "   $($resultadoAnonimizado.anonymizedMessage)" -ForegroundColor Green
    Write-Host ""
    
    # Guardar el mensaje anonimizado para el siguiente paso
    $mensajeAnonimizado = $resultadoAnonimizado.anonymizedMessage
} catch {
    Write-Host "   ✗ Error al anonimizar: $_" -ForegroundColor Red
    exit 1
}

# 3. Ejemplo: Desanonimizar un mensaje (usando tokens semilla)
Write-Host "3. Desanonimizando mensaje con tokens semilla..." -ForegroundColor Yellow
$mensajeAnonimizadoSemilla = "oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb"

$bodyDesanonimizar = @{
    anonymizedMessage = $mensajeAnonimizadoSemilla
} | ConvertTo-Json -Compress

Write-Host "   Mensaje anonimizado:" -ForegroundColor Gray
Write-Host "   $mensajeAnonimizadoSemilla" -ForegroundColor White
Write-Host ""

try {
    $resultadoDesanonimizado = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/deanonymize" -ContentType "application/json" -Body $bodyDesanonimizar
    Write-Host "   Mensaje desanonimizado:" -ForegroundColor Gray
    Write-Host "   $($resultadoDesanonimizado.message)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "   ✗ Error al desanonimizar: $_" -ForegroundColor Red
    exit 1
}

# 4. Desanonimizar el mensaje que acabamos de anonimizar
Write-Host "4. Desanonimizando el mensaje del paso 2..." -ForegroundColor Yellow
$bodyDesanonimizar2 = @{
    anonymizedMessage = $mensajeAnonimizado
} | ConvertTo-Json -Compress

Write-Host "   Mensaje anonimizado:" -ForegroundColor Gray
Write-Host "   $mensajeAnonimizado" -ForegroundColor White
Write-Host ""

try {
    $resultadoDesanonimizado2 = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/deanonymize" -ContentType "application/json" -Body $bodyDesanonimizar2
    Write-Host "   Mensaje desanonimizado:" -ForegroundColor Gray
    Write-Host "   $($resultadoDesanonimizado2.message)" -ForegroundColor Green
    Write-Host ""
    
    # Verificar que sea el mismo mensaje original
    $coincide = $resultadoDesanonimizado2.message -eq $mensajeOriginal
    if ($coincide -eq $true) {
        Write-Host "   OK: El mensaje coincide con el original!" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: El mensaje desanonimizado no coincide completamente" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ✗ Error al desanonimizar: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Proceso completado exitosamente ===" -ForegroundColor Cyan
