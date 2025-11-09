# Test script for demo endpoints
$body = @{
    anonymizedMessage = "oferta de trabajo para NAME_e1be92e2b3a5 con email EMAIL_8004719c6ea5 y telefono PHONE_40e83067b9cb"
} | ConvertTo-Json -Compress

Write-Host "Testing /deanonymize endpoint..."
Write-Host "Request body: $body"
$response = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/deanonymize" -ContentType "application/json" -Body $body
Write-Host "Response:"
$response | ConvertTo-Json -Compress
Write-Host ""

# Test anonymize endpoint
$body2 = @{
    message = "oferta de trabajo para johanna Correa con email johanna.correa.c@gmail.com y teléfono 3157090897"
} | ConvertTo-Json -Compress

Write-Host "Testing /anonymize endpoint..."
Write-Host "Request body: $body2"
$response2 = Invoke-RestMethod -Method Post -Uri "http://localhost:3001/anonymize" -ContentType "application/json" -Body $body2
Write-Host "Response:"
$response2 | ConvertTo-Json -Compress

