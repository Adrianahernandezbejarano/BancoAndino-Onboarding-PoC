# Prompt para DiagramGPT - Arquitectura SIVD Banco Andino

## Descripción para DiagramGPT

Crea un diagrama de arquitectura de microservicios en AWS para el Sistema Inteligente de Validación Documental (SIVD) del Banco Andino. La arquitectura debe incluir las siguientes capas y componentes:

### CAPA DE INTERNET Y SEGURIDAD

- AWS WAF (Web Application Firewall) para protección de aplicaciones
- Amazon CloudFront como CDN global para distribución de contenido
- AWS Shield para protección DDoS
- Los usuarios de Internet se conectan primero a CloudFront, que está protegido por WAF y Shield

### CAPA DE BALANCEO DE CARGA

- Application Load Balancer (ALB) que distribuye el tráfico entre los servicios
- El ALB recibe el tráfico desde CloudFront

### CAPA DE PRESENTACIÓN (Frontend)

- Portal Cliente: aplicación React alojada en Amazon S3, servida por CloudFront, para onboarding digital de clientes
- Portal Analista: aplicación React alojada en Amazon S3, servida por CloudFront, para revisión y gestión por analistas
- Portal Admin: aplicación React alojada en Amazon S3, servida por CloudFront, para configuración administrativa
- Los tres portales se conectan al ALB

### CAPA DE API GATEWAY

- Amazon API Gateway (REST API y WebSocket API)
- El API Gateway recibe las peticiones desde el ALB
- El API Gateway actúa como punto de entrada único para todos los microservicios

### CAPA DE MICROSERVICIOS (ECS Fargate)

Todos los microservicios están ejecutándose en Amazon ECS Fargate y se comunican a través del API Gateway:

1. **Cliente Service** (Node.js/Express)
   - Se conecta a RDS PostgreSQL para almacenar datos de clientes
   - Gestiona la información de clientes

2. **Formulario Service** (Node.js/Express)
   - Se conecta a RDS PostgreSQL para almacenar formularios digitales
   - Gestiona formularios de onboarding

3. **Documento Service** (Python/FastAPI)
   - Se conecta a Amazon DynamoDB para metadatos de documentos
   - Se conecta a Amazon S3 para almacenar archivos de documentos
   - Gestiona la carga y almacenamiento de documentos

4. **OCR/IDP Service** (Python/FastAPI)
   - Se conecta a Amazon Textract para extracción de texto OCR
   - Se conecta a Amazon Comprehend para procesamiento de lenguaje natural (IDP)
   - Se conecta a Amazon DynamoDB para almacenar resultados de extracción
   - Procesa documentos para extraer información

5. **Validación Service** (Python/FastAPI)
   - Se conecta a RDS PostgreSQL para almacenar resultados de validación
   - Compara datos del formulario con datos extraídos de documentos

6. **Reglas/IA Service** (Python/FastAPI)
   - Se conecta a Amazon SageMaker para modelos de machine learning
   - Se conecta a Amazon ElastiCache Redis para caché de reglas y resultados
   - Aplica reglas de negocio y modelos de IA para validación

7. **Reporte Service** (Node.js/Express)
   - Se conecta a RDS PostgreSQL para datos de reportes
   - Se conecta a Amazon QuickSight para visualización de datos
   - Genera reportes y dashboards

8. **Notificación Service** (Node.js/Express)
   - Se conecta a Amazon SNS (Simple Notification Service) para notificaciones push
   - Se conecta a Amazon SES (Simple Email Service) para notificaciones por email
   - Envía notificaciones a clientes y analistas

### CAPA DE MENSAJERÍA ASÍNCRONA

- Amazon SQS (Simple Queue Service) para colas de mensajes entre servicios
- Amazon EventBridge para eventos y orquestación de servicios
- Los microservicios se comunican entre sí mediante SQS y EventBridge para operaciones asíncronas

### SERVICIOS DE INFRAESTRUCTURA Y SEGURIDAD

- AWS Cognito para autenticación y autorización de usuarios
- AWS Secrets Manager para gestión segura de secretos y credenciales
- Amazon CloudWatch para monitoreo, logs y métricas
- AWS X-Ray para trazabilidad distribuida y análisis de rendimiento

### FLUJOS DE DATOS PRINCIPALES

1. **Flujo de Onboarding:**
   - Usuario → CloudFront → WAF → ALB → Portal Cliente → API Gateway → Cliente Service → RDS PostgreSQL
   - Usuario → Portal Cliente → API Gateway → Documento Service → S3 (almacenamiento) + DynamoDB (metadatos)
   - Usuario → Portal Cliente → API Gateway → Formulario Service → RDS PostgreSQL

2. **Flujo de Procesamiento:**
   - Documento Service → SQS/EventBridge → OCR/IDP Service
   - OCR/IDP Service → Textract → OCR/IDP Service → DynamoDB
   - OCR/IDP Service → Comprehend → OCR/IDP Service → DynamoDB
   - OCR/IDP Service → SQS/EventBridge → Validación Service
   - Validación Service → RDS PostgreSQL
   - Validación Service → SQS/EventBridge → Reglas/IA Service
   - Reglas/IA Service → SageMaker → Reglas/IA Service → ElastiCache Redis
   - Reglas/IA Service → SQS/EventBridge → Reporte Service
   - Reporte Service → RDS PostgreSQL + QuickSight
   - Reglas/IA Service → SQS/EventBridge → Notificación Service
   - Notificación Service → SNS + SES

3. **Flujo de Revisión:**
   - Analista → CloudFront → Portal Analista → API Gateway → Reporte Service → RDS PostgreSQL
   - Analista → Portal Analista → API Gateway → Validación Service → RDS PostgreSQL

### CARACTERÍSTICAS DE LA ARQUITECTURA

- Alta disponibilidad: despliegue Multi-AZ con Auto Scaling
- Escalabilidad: ECS Fargate con escalado automático basado en métricas
- Seguridad: VPC aislada, Cognito, Secrets Manager, WAF + Shield
- Rendimiento: CloudFront CDN, ElastiCache Redis, balanceo de carga
- Observabilidad: CloudWatch + X-Ray para monitoreo completo
- Desacoplamiento: SQS/EventBridge para comunicación asíncrona

---

## Instrucciones para usar en DiagramGPT

1. Ve a https://diagramgpt.com/ o la herramienta de DiagramGPT que prefieras
2. Copia y pega la descripción completa de arriba
3. DiagramGPT generará un diagrama visual de la arquitectura
4. Puedes exportar el diagrama en el formato que necesites (PNG, SVG, etc.)

## Notas Adicionales

- Todos los servicios están desplegados en una VPC privada de AWS
- Los servicios de base de datos (RDS, DynamoDB) están en subredes privadas
- Los servicios de ECS Fargate están en subredes privadas con acceso a Internet a través de NAT Gateway
- Los servicios de almacenamiento (S3) tienen políticas IAM restrictivas
- Todos los servicios están integrados con CloudWatch para logging y métricas
- X-Ray está habilitado para trazabilidad distribuida en todos los servicios
