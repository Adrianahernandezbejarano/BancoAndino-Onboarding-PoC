# Generación de Diagrama de Arquitectura con DiagramGPT

Este directorio contiene los prompts necesarios para generar el diagrama de arquitectura del Sistema Inteligente de Validación Documental (SIVD) del Banco Andino usando DiagramGPT.

## Archivos Disponibles

1. **`diagramgpt-prompt-sivd.md`** - Versión detallada y completa del prompt con explicaciones extensas
2. **`diagramgpt-prompt-sivd-conciso.txt`** - Versión concisa del prompt para DiagramGPT

## Cómo Usar DiagramGPT

### Opción 1: Usando DiagramGPT.com

1. Visita [https://diagramgpt.com/](https://diagramgpt.com/)
2. Copia el contenido de `diagramgpt-prompt-sivd-conciso.txt` o la sección de descripción de `diagramgpt-prompt-sivd.md`
3. Pega el contenido en el campo de texto de DiagramGPT
4. DiagramGPT generará automáticamente el diagrama de arquitectura
5. Exporta el diagrama en el formato que necesites (PNG, SVG, PDF, etc.)

### Opción 2: Usando ChatGPT con DiagramGPT Plugin

1. Abre ChatGPT con el plugin DiagramGPT habilitado
2. Copia el prompt completo de `diagramgpt-prompt-sivd.md`
3. Pega el prompt y solicita que genere el diagrama
4. ChatGPT generará el diagrama usando DiagramGPT

### Opción 3: Usando otras herramientas compatibles

Muchas herramientas de diagramación con IA aceptan descripciones en lenguaje natural. Puedes usar cualquiera de los prompts en:

- Mermaid AI
- Draw.io con plantillas de arquitectura AWS
- Lucidchart con generación automática

## Recomendaciones

- **Para mejor resultado:** Usa la versión detallada (`diagramgpt-prompt-sivd.md`) si la herramienta acepta descripciones largas
- **Para herramientas con límites:** Usa la versión concisa (`diagramgpt-prompt-sivd-conciso.txt`)
- **Personalización:** Puedes modificar los prompts según tus necesidades específicas

## Componentes de la Arquitectura

La arquitectura incluye:

### Capas de Seguridad y Red

- AWS WAF, CloudFront, AWS Shield

### Capa de Presentación

- 3 Portales React (Cliente, Analista, Admin)

### Capa de API

- Amazon API Gateway

### Microservicios (8 servicios)

- Cliente Service
- Formulario Service
- Documento Service
- OCR/IDP Service
- Validación Service
- Reglas/IA Service
- Reporte Service
- Notificación Service

### Servicios de Mensajería

- SQS, EventBridge

### Servicios de Infraestructura

- Cognito, Secrets Manager, CloudWatch, X-Ray

### Bases de Datos y Almacenamiento

- RDS PostgreSQL, DynamoDB, S3, ElastiCache Redis

### Servicios de IA/ML

- Textract, Comprehend, SageMaker

### Servicios de Notificación y Visualización

- SNS, SES, QuickSight

## Resultado Esperado

El diagrama generado debería mostrar:

- Las capas de la arquitectura organizadas de arriba a abajo
- Las conexiones entre componentes
- Los servicios AWS utilizados
- Los flujos de datos principales
- Las agrupaciones lógicas de servicios

## Notas

- El diagrama puede variar según la herramienta utilizada
- Puedes ajustar el prompt para obtener diferentes estilos de visualización
- Algunas herramientas pueden requerir ajustes menores en el formato del prompt
