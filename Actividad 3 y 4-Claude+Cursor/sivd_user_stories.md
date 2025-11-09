# User Stories MVP - Sistema Inteligente de Validación Documental (SIVD)

## Banco Andino - Onboarding Personas Naturales

---

## ÉPICA 1: REGISTRO Y FORMULARIO DIGITAL

### US-001: Iniciar proceso de onboarding

**Como** cliente nuevo del Banco Andino  
**Quiero** acceder al portal de onboarding digital  
**Para** iniciar mi proceso de apertura de cuenta sin ir a una sucursal

**Criterios de Aceptación:**

- El cliente puede acceder al portal desde web y móvil
- Se muestra información clara sobre requisitos y documentos necesarios
- El cliente puede crear una cuenta con email y contraseña
- Se envía un email de verificación
- El sistema registra la fecha/hora de inicio del proceso

**Prioridad:** ALTA  
**Estimación:** 5 puntos  
**Dependencias:** Ninguna

---

### US-002: Completar datos personales en formulario

**Como** cliente  
**Quiero** ingresar mis datos personales básicos en el formulario digital  
**Para** proporcionar la información requerida para mi cuenta

**Criterios de Aceptación:**

- Formulario incluye campos: tipo de identificación, número, nombres, apellidos, fecha de nacimiento, nacionalidad
- Validación en tiempo real de formato de campos (sin caracteres especiales en nombres, formato de cédula)
- El sistema detecta si el cliente ya existe en la base de datos
- Se puede guardar progreso y continuar después
- Todos los campos obligatorios están marcados claramente

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-001

---

### US-003: Completar datos de contacto y residencia

**Como** cliente  
**Quiero** ingresar mi información de contacto y dirección  
**Para** que el banco pueda comunicarse conmigo y verificar mi residencia

**Criterios de Aceptación:**

- Formulario incluye: dirección completa, ciudad, código postal, teléfono, email
- Validación de formato de teléfono y email
- Autocompletado de dirección con sugerencias
- Campos separados para tipo de vivienda (propia, arrendada, familiar)
- Tiempo de residencia en dirección actual

**Prioridad:** ALTA  
**Estimación:** 5 puntos  
**Dependencias:** US-002

---

### US-004: Completar información financiera

**Como** cliente  
**Quiero** declarar mi información financiera y laboral  
**Para** que el banco evalúe mi perfil económico

**Criterios de Aceptación:**

- Campos para: ocupación, tipo de contrato, nombre empresa, ingresos mensuales, otros ingresos
- Validación de rangos razonables de ingresos
- Lista desplegable de profesiones/ocupaciones
- Campo para origen de fondos
- Declaración de persona expuesta políticamente (PEP)

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-003

---

### US-005: Revisar y confirmar información del formulario

**Como** cliente  
**Quiero** revisar todos los datos ingresados antes de enviar  
**Para** asegurarme que la información es correcta

**Criterios de Aceptación:**

- Vista resumen de todas las secciones completadas
- Opción de editar cualquier sección
- Indicador visual de secciones completas/incompletas
- Checkbox de aceptación de términos y condiciones
- Botón "Enviar formulario" solo habilitado si todo está completo

**Prioridad:** ALTA  
**Estimación:** 5 puntos  
**Dependencias:** US-004

---

## ÉPICA 2: CARGA DE DOCUMENTOS

### US-006: Cargar documento de identidad (cédula/pasaporte)

**Como** cliente  
**Quiero** cargar mi documento de identidad  
**Para** verificar mi identidad ante el banco

**Criterios de Aceptación:**

- Soporta carga por foto (cámara) o archivo (PDF, JPG, PNG)
- Detecta y rechaza imágenes borrosas o con poca luz
- Guía visual para posicionar correctamente el documento
- Validación de tamaño máximo (5MB)
- Previsualización antes de confirmar carga
- Permite cargar anverso y reverso por separado
- Barra de progreso durante la carga

**Prioridad:** CRÍTICA  
**Estimación:** 13 puntos  
**Dependencias:** US-005

---

### US-007: Cargar comprobante de ingresos

**Como** cliente  
**Quiero** cargar mi comprobante de ingresos  
**Para** validar la información financiera declarada

**Criterios de Aceptación:**

- Acepta: colilla de pago, certificado laboral, declaración de renta
- Formatos: PDF, JPG, PNG, DOCX
- Validación de que el documento tiene fecha reciente (últimos 3 meses)
- Sistema detecta tipo de documento automáticamente
- Permite cargar hasta 3 documentos de ingresos

**Prioridad:** CRÍTICA  
**Estimación:** 8 puntos  
**Dependencias:** US-006

---

### US-008: Cargar comprobante de domicilio

**Como** cliente  
**Quiero** cargar un comprobante de mi dirección de residencia  
**Para** verificar que vivo donde declaré en el formulario

**Criterios de Aceptación:**

- Acepta: recibo de servicios públicos, extracto bancario, contrato arriendo
- Documento debe tener fecha de emisión no mayor a 3 meses
- Sistema verifica que el nombre en el documento coincida con el del cliente
- Dirección en documento debe ser legible
- Mensaje claro si el documento es rechazado

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-006

---

### US-009: Ver estado de carga de documentos

**Como** cliente  
**Quiero** ver qué documentos he cargado y cuáles faltan  
**Para** completar todos los requisitos del onboarding

**Criterios de Aceptación:**

- Lista visual de documentos requeridos
- Indicadores: "Cargado", "Pendiente", "Rechazado", "En validación"
- Opción de reemplazar documentos rechazados
- Notificación si algún documento es rechazado con motivo específico
- Botón para continuar solo si documentos obligatorios están cargados

**Prioridad:** ALTA  
**Estimación:** 5 puntos  
**Dependencias:** US-006, US-007, US-008

---

## ÉPICA 3: EXTRACCIÓN Y PROCESAMIENTO OCR

### US-010: Extraer datos de documento de identidad

**Como** sistema SIVD  
**Quiero** extraer automáticamente los datos del documento de identidad  
**Para** comparar con la información del formulario digital

**Criterios de Aceptación:**

- Extrae: número de identificación, nombres, apellidos, fecha de nacimiento, fecha de expedición, fecha de vencimiento
- Nivel de confianza mínimo del 85% por campo
- Procesa documentos en menos de 10 segundos
- Si confianza < 85%, marca campo para revisión manual
- Almacena coordenadas de cada campo extraído en el documento

**Prioridad:** CRÍTICA  
**Estimación:** 13 puntos  
**Dependencias:** US-006

---

### US-011: Extraer datos de comprobante de ingresos

**Como** sistema SIVD  
**Quiero** extraer la información financiera de los comprobantes de ingresos  
**Para** validar contra lo declarado en el formulario

**Criterios de Aceptación:**

- Extrae: nombre del empleado, monto del salario, nombre de la empresa, período, fecha de emisión
- Identifica automáticamente el tipo de comprobante
- Maneja diferentes formatos de colillas de pago
- Convierte montos en texto a números
- Detecta moneda del documento

**Prioridad:** CRÍTICA  
**Estimación:** 13 puntos  
**Dependencias:** US-007

---

### US-012: Extraer datos de comprobante de domicilio

**Como** sistema SIVD  
**Quiero** extraer la dirección y datos del comprobante de domicilio  
**Para** validar la residencia declarada

**Criterios de Aceptación:**

- Extrae: nombre del titular, dirección completa, fecha de emisión, tipo de servicio
- Normaliza formatos de direcciones (calle, carrera, número, etc.)
- Identifica automáticamente el tipo de comprobante
- Valida fecha de emisión no mayor a 3 meses

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-008

---

## ÉPICA 4: VALIDACIÓN Y COMPARACIÓN

### US-013: Comparar datos personales (Formulario vs Documento ID)

**Como** sistema SIVD  
**Quiero** comparar los datos personales del formulario contra el documento de identidad  
**Para** detectar inconsistencias en información básica

**Criterios de Aceptación:**

- Compara: número de identificación, nombres completos, apellidos, fecha de nacimiento
- Calcula score de similitud usando algoritmos de distancia de Levenshtein
- Tolera pequeñas diferencias ortográficas (tildes, espacios)
- Genera inconsistencia CRÍTICA si número ID no coincide exactamente
- Genera inconsistencia ALTA si nombres difieren más del 15%

**Prioridad:** CRÍTICA  
**Estimación:** 13 puntos  
**Dependencias:** US-010

---

### US-014: Validar vigencia del documento de identidad

**Como** sistema SIVD  
**Quiero** verificar que el documento de identidad esté vigente  
**Para** asegurar que el cliente presenta documentos válidos

**Criterios de Aceptación:**

- Compara fecha de vencimiento del documento contra fecha actual
- Genera alerta CRÍTICA si documento está vencido
- Alerta MEDIA si documento vence en menos de 3 meses
- Valida que fecha de expedición sea anterior a fecha actual
- Valida coherencia entre fecha de nacimiento y edad aparente del documento

**Prioridad:** CRÍTICA  
**Estimación:** 5 puntos  
**Dependencias:** US-010

---

### US-015: Comparar información de ingresos

**Como** sistema SIVD  
**Quiero** comparar los ingresos declarados vs los documentados  
**Para** detectar discrepancias en información financiera

**Criterios de Aceptación:**

- Compara monto declarado en formulario vs monto en comprobante
- Tolera diferencia de ±10% (variaciones por bonos, deducciones)
- Genera inconsistencia ALTA si diferencia > 20%
- Genera inconsistencia MEDIA si diferencia entre 10-20%
- Verifica que el comprobante sea reciente (< 3 meses)

**Prioridad:** CRÍTICA  
**Estimación:** 8 puntos  
**Dependencias:** US-011

---

### US-016: Comparar información de domicilio

**Como** sistema SIVD  
**Quiero** validar que la dirección declarada coincida con el comprobante  
**Para** verificar residencia del cliente

**Criterios de Aceptación:**

- Normaliza ambas direcciones antes de comparar
- Compara componentes: tipo de vía, número, barrio, ciudad
- Tolera pequeñas diferencias en formato (Calle vs Cl., # vs Nro)
- Genera inconsistencia ALTA si ciudad no coincide
- Genera inconsistencia MEDIA si dirección específica difiere

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-012

---

### US-017: Validar coherencia del nombre en todos los documentos

**Como** sistema SIVD  
**Quiero** verificar que el nombre del cliente sea consistente en todos los documentos  
**Para** detectar posibles fraudes o errores

**Criterios de Aceptación:**

- Compara nombre en: formulario, documento ID, comprobante ingresos, comprobante domicilio
- Identifica variaciones: nombre completo vs nombre corto, uso de segundo nombre
- Genera inconsistencia ALTA si nombres difieren significativamente entre documentos
- Permite variaciones comunes (María vs Ma., José vs J.)

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-010, US-011, US-012

---

## ÉPICA 5: MOTOR DE REGLAS Y DECISIÓN

### US-018: Aplicar reglas de negocio del banco

**Como** sistema SIVD  
**Quiero** aplicar las políticas de validación del Banco Andino  
**Para** asegurar cumplimiento normativo y políticas internas

**Criterios de Aceptación:**

- Valida edad mínima del cliente (18 años)
- Verifica que ingresos mínimos cumplan umbral del banco
- Aplica reglas específicas según tipo de cuenta solicitada
- Valida que cliente no esté en listas restrictivas (mock para MVP)
- Cada regla tiene severidad asignada (Crítica, Alta, Media, Baja)

**Prioridad:** CRÍTICA  
**Estimación:** 13 puntos  
**Dependencias:** US-013, US-014, US-015, US-016

---

### US-019: Calcular score de validación general

**Como** sistema SIVD  
**Quiero** calcular un score general de validación  
**Para** determinar si el caso requiere revisión manual

**Criterios de Aceptación:**

- Score de 0-100 basado en todas las validaciones
- Ponderación: inconsistencias críticas (-30), altas (-20), medias (-10), bajas (-5)
- Score > 80: Aprobación automática
- Score 60-80: Revisión manual recomendada
- Score < 60: Rechazo o revisión manual obligatoria
- Score se recalcula si cliente corrige información

**Prioridad:** CRÍTICA  
**Estimación:** 8 puntos  
**Dependencias:** US-018

---

### US-020: Generar resultado de validación

**Como** sistema SIVD  
**Quiero** consolidar todos los resultados en un reporte estructurado  
**Para** informar la decisión sobre el onboarding

**Criterios de Aceptación:**

- Estado final: APROBADO, EN_REVISIÓN, RECHAZADO, CORRECCIÓN_REQUERIDA
- Lista detallada de inconsistencias encontradas
- Score general de validación
- Campos específicos que requieren atención
- Timestamp de la validación
- Recomendación de acción (aprobar, revisar, rechazar)

**Prioridad:** CRÍTICA  
**Estimación:** 8 puntos  
**Dependencias:** US-019

---

## ÉPICA 6: NOTIFICACIONES Y COMUNICACIÓN CON CLIENTE

### US-021: Notificar resultado de validación al cliente

**Como** cliente  
**Quiero** recibir notificación del resultado de mi validación  
**Para** saber si mi onboarding fue exitoso o requiere acciones

**Criterios de Aceptación:**

- Email automático con resultado (aprobado/en revisión/requiere corrección)
- Notificación in-app en el portal
- Si aprobado: próximos pasos para completar apertura
- Si requiere corrección: lista específica de qué corregir
- Si en revisión: tiempo estimado de respuesta (24-48 horas)

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-020

---

### US-022: Solicitar corrección de inconsistencias al cliente

**Como** cliente  
**Quiero** saber exactamente qué inconsistencias se encontraron  
**Para** corregir la información de manera eficiente

**Criterios de Aceptación:**

- Lista clara de campos con inconsistencias
- Comparación lado a lado: "Dijiste X en formulario, pero documento dice Y"
- Instrucciones específicas de cómo corregir
- Opción de corregir en formulario o recargar documento
- Plazo para realizar correcciones (7 días)

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-021

---

### US-023: Ver estado del proceso de validación en tiempo real

**Como** cliente  
**Quiero** ver el progreso de mi validación  
**Para** saber en qué etapa está mi solicitud

**Criterios de Aceptación:**

- Dashboard con estados: "Documentos cargados", "En validación", "Validación completada"
- Barra de progreso visual
- Indicador de tiempo estimado restante
- Historial de acciones realizadas
- Actualización en tiempo real sin necesidad de refrescar

**Prioridad:** MEDIA  
**Estimación:** 5 puntos  
**Dependencias:** US-009

---

## ÉPICA 7: PORTAL DE ANALISTA

### US-024: Ver cola de casos para revisión manual

**Como** analista bancario  
**Quiero** ver todos los casos que requieren revisión manual  
**Para** priorizar y gestionar mi trabajo

**Criterios de Aceptación:**

- Lista de casos ordenados por prioridad (score más bajo primero)
- Filtros por: estado, rango de fechas, tipo de inconsistencia, score
- Búsqueda por número de identificación o nombre
- Indicador de tiempo en cola
- Contador de casos pendientes por analista

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-020

---

### US-025: Revisar detalles de un caso específico

**Como** analista bancario  
**Quiero** ver toda la información de un caso en una sola pantalla  
**Para** tomar una decisión informada

**Criterios de Aceptación:**

- Vista unificada: formulario, documentos cargados, datos extraídos
- Comparación visual lado a lado de inconsistencias
- Score de validación y detalle de cada regla aplicada
- Imágenes de documentos originales con zoom
- Historial de acciones del cliente
- Campos marcados en documentos (coordenadas OCR)

**Prioridad:** ALTA  
**Estimación:** 13 puntos  
**Dependencias:** US-024

---

### US-026: Aprobar o rechazar caso manualmente

**Como** analista bancario  
**Quiero** tomar una decisión sobre un caso en revisión  
**Para** continuar o detener el proceso de onboarding

**Criterios de Aceptación:**

- Opciones: Aprobar, Rechazar, Solicitar más información
- Campo obligatorio de observaciones/justificación
- Si rechaza: debe seleccionar motivo de lista predefinida
- Si solicita información: especificar qué documentos/datos adicionales
- Decisión queda registrada con timestamp y usuario
- Cliente es notificado automáticamente de la decisión

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** US-025

---

### US-027: Solicitar documentos adicionales

**Como** analista bancario  
**Quiero** solicitar documentos complementarios al cliente  
**Para** resolver dudas sobre inconsistencias

**Criterios de Aceptación:**

- Lista de tipos de documentos que puede solicitar
- Campo de texto para instrucciones específicas
- Sistema notifica al cliente vía email y in-app
- Cliente puede cargar documentos solicitados en su portal
- Analista recibe notificación cuando cliente carga documentos
- Caso vuelve a la cola del analista automáticamente

**Prioridad:** MEDIA  
**Estimación:** 8 puntos  
**Dependencias:** US-025

---

## ÉPICA 8: REPORTERÍA Y AUDITORÍA

### US-028: Generar reporte de validación para el cliente

**Como** sistema SIVD  
**Quiero** generar un reporte en PDF del resultado de validación  
**Para** que el cliente tenga registro oficial del proceso

**Criterios de Aceptación:**

- PDF con logo del banco y formato profesional
- Resumen ejecutivo del resultado
- Lista de documentos validados con estado
- Inconsistencias encontradas (si aplica)
- Fecha y hora de validación
- Número de referencia único
- Descargable desde el portal del cliente

**Prioridad:** MEDIA  
**Estimación:** 8 puntos  
**Dependencias:** US-020

---

### US-029: Registrar trazabilidad completa del proceso

**Como** oficial de cumplimiento  
**Quiero** tener registro auditable de todas las acciones  
**Para** cumplir con requisitos regulatorios

**Criterios de Aceptación:**

- Log de todas las acciones: carga documentos, validaciones, decisiones
- Registro con: timestamp, usuario, acción, antes/después
- Almacenamiento inmutable (no se puede editar logs)
- Incluye IP y dispositivo de cada acción del cliente
- Registro de cada regla aplicada y su resultado
- Mantener logs por mínimo 5 años

**Prioridad:** ALTA  
**Estimación:** 8 puntos  
**Dependencias:** Todas las US anteriores

---

### US-030: Dashboard de métricas operativas

**Como** gerente de operaciones  
**Quiero** ver métricas del desempeño del SIVD  
**Para** identificar cuellos de botella y oportunidades de mejora

**Criterios de Aceptación:**

- KPIs: casos procesados/día, tiempo promedio de validación, tasa de aprobación automática
- Tasa de inconsistencias por tipo de documento
- Casos en revisión manual vs casos totales
- Tiempo promedio de resolución por analista
- Gráficos de tendencias (últimos 7, 30, 90 días)
- Exportable a Excel/PDF

**Prioridad:** BAJA  
**Estimación:** 13 puntos  
**Dependencias:** US-029

---

## RESUMEN DE PRIORIZACIÓN

### Críticas (Implementar Primero - Sprint 1-2):

- US-001, US-002, US-003, US-004, US-005 (Formulario digital completo)
- US-006, US-007 (Carga de documentos críticos)
- US-010, US-011 (Extracción OCR básica)
- US-013, US-014, US-015 (Validaciones básicas)
- US-018, US-019, US-020 (Motor de decisión)

### Altas (Implementar Segundo - Sprint 3-4):

- US-008, US-009 (Comprobante domicilio y gestión documentos)
- US-012, US-016, US-017 (Validaciones adicionales)
- US-021, US-022 (Notificaciones al cliente)
- US-024, US-025, US-026 (Portal analista básico)
- US-029 (Auditoría)

### Medias (Implementar Tercero - Sprint 5):

- US-023 (Estado en tiempo real)
- US-027 (Solicitud documentos adicionales)
- US-028 (Reporte PDF)

### Bajas (Mejoras futuras):

- US-030 (Dashboard métricas)

---

**Total User Stories:** 30  
**Estimación Total:** 265 puntos  
**Sprints Estimados:** 5-6 sprints de 2 semanas (10-12 semanas)
