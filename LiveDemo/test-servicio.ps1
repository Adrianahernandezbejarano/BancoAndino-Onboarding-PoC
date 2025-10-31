# Script de pruebas para el servicio de anonimización
# Prueba casos exitosos y manejo de errores

Write-Host "=== PRUEBAS DEL SERVICIO DE ANONIMIZACION ===" -ForegroundColor Cyan
Write-Host ""

# Función auxiliar para hacer requests
function Test-Endpoint {
    param(
        [string]$Method,
        [string]$Uri,
        [hashtable]$Body,
        [string]$ExpectedStatus
    )
    
    try {
        if ($Body) {
            $jsonBody = $Body | ConvertTo-Json -Compress
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -ContentType "application/json" -Body $jsonBody -ErrorAction Stop
            Write-Host "  Status: OK" -ForegroundColor Green
            Write-Host "  Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
            return $true
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Uri -ErrorAction Stop
            Write-Host "  Status: OK" -ForegroundColor Green
            Write-Host "  Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
            return $true
        }
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq $ExpectedStatus) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd() | ConvertFrom-Json
            Write-Host "  Status: $statusCode (Esperado)" -ForegroundColor Yellow
            Write-Host "  Error: $($responseBody.error)" -ForegroundColor Gray
            if ($responseBody.details) {
                Write-Host "  Details: $($responseBody.details)" -ForegroundColor Gray
            }
            return $true
        } else {
            Write-Host "  Status: $statusCode (Inesperado)" -ForegroundColor Red
            Write-Host "  Error: $_" -ForegroundColor Red
            return $false
        }
    }
}

# Test 1: Health check
Write-Host "1. Test: Health Check" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Uri "http://localhost:3001/health"
Write-Host ""

# Test 2: Anonimización exitosa
Write-Host "2. Test: Anonimización exitosa" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/anonymize" -Body @{ message = "oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897" }
Write-Host ""

# Test 3: Desanonimización exitosa (con tokens semilla)
Write-Host "3. Test: Desanonimización exitosa (tokens semilla)" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/deanonymize" -Body @{ anonymizedMessage = "oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb" }
Write-Host ""

# Test 4: Error - Campo faltante
Write-Host "4. Test: Error - Campo 'message' faltante" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/anonymize" -Body @{ otroCampo = "test" } -ExpectedStatus 400
Write-Host ""

# Test 5: Error - Tipo incorrecto
Write-Host "5. Test: Error - 'message' no es string" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/anonymize" -Body @{ message = 12345 } -ExpectedStatus 400
Write-Host ""

# Test 6: Error - Campo vacío
Write-Host "6. Test: Error - 'message' vacío" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/anonymize" -Body @{ message = "" } -ExpectedStatus 400
Write-Host ""

# Test 7: Error - Campo faltante en deanonymize
Write-Host "7. Test: Error - Campo 'anonymizedMessage' faltante" -ForegroundColor Yellow
Test-Endpoint -Method "POST" -Uri "http://localhost:3001/deanonymize" -Body @{ otroCampo = "test" } -ExpectedStatus 400
Write-Host ""

# Test 8: Error - Ruta no encontrada
Write-Host "8. Test: Error - Ruta no encontrada" -ForegroundColor Yellow
Test-Endpoint -Method "GET" -Uri "http://localhost:3001/ruta-inexistente" -ExpectedStatus 404
Write-Host ""

Write-Host "=== PRUEBAS COMPLETADAS ===" -ForegroundColor Cyan

