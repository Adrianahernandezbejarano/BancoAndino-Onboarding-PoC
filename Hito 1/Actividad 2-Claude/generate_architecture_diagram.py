"""
Script para generar diagrama de arquitectura SIVD en PNG
Usa la biblioteca diagrams de Python
"""

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.security import Cognito, SecretsManager, WAF, Shield, Kms, Iam
from diagrams.aws.network import CloudFront, ALB, APIGateway
from diagrams.aws.storage import S3
from diagrams.aws.database import RDS, Dynamodb, ElastiCache
from diagrams.aws.compute import ECS, Lambda
from diagrams.aws.integration import SQS, SNS, Eventbridge
from diagrams.aws.ml import Textract, Comprehend, Sagemaker, Rekognition
from diagrams.aws.analytics import Quicksight
from diagrams.aws.management import Cloudwatch
from diagrams.aws.engagement import SES
from diagrams.onprem.client import Users, Client

# Configuración del diagrama
graph_attr = {
    "fontsize": "12",
    "bgcolor": "white",
    "pad": "0.5",
    "splines": "ortho",
    "rankdir": "TB"
}

with Diagram(
    "Arquitectura SIVD - Banco Andino",
    filename="sivd_architecture",
    show=False,
    direction="TB",
    graph_attr=graph_attr,
    outformat="png"
):
    
    # Capa de Internet y Seguridad
    with Cluster("Capa de Internet y Seguridad"):
        waf = WAF("AWS WAF")
        cloudfront = CloudFront("CloudFront CDN")
        shield = Shield("AWS Shield")
    
    # Capa de Balanceo de Carga
    with Cluster("Balanceo de Carga"):
        alb = ALB("Application Load Balancer")
    
    # Capa de Presentación
    with Cluster("Capa de Presentación (React + S3)"):
        portal_cliente = S3("Portal Cliente")
        portal_analista = S3("Portal Analista")
        portal_admin = S3("Portal Admin")
    
    # Capa de API Gateway
    api_gateway = APIGateway("API Gateway\n(REST + WebSocket)")
    
    # Capa de Microservicios
    with Cluster("Microservicios (ECS Fargate)"):
        with Cluster("Servicios Node.js"):
            cliente_service = ECS("Cliente Service\nNode.js/Express")
            formulario_service = ECS("Formulario Service\nNode.js/Express")
            reporte_service = ECS("Reporte Service\nNode.js/Express")
            notificacion_service = ECS("Notificación Service\nNode.js/Express")
        
        with Cluster("Servicios Python"):
            documento_service = ECS("Documento Service\nPython/FastAPI")
            ocr_service = ECS("OCR/IDP Service\nPython/FastAPI")
            validacion_service = ECS("Validación Service\nPython/FastAPI")
            reglas_service = ECS("Reglas/IA Service\nPython/FastAPI")
    
    # Capa de Mensajería
    with Cluster("Mensajería Asíncrona"):
        sqs = SQS("Amazon SQS")
        eventbridge = Eventbridge("EventBridge")
    
    # Bases de Datos
    with Cluster("Bases de Datos"):
        rds_postgres = RDS("RDS PostgreSQL")
        dynamodb = Dynamodb("DynamoDB")
        s3_storage = S3("S3 Storage")
        redis = ElastiCache("ElastiCache Redis")
    
    # Servicios AWS de IA/ML
    with Cluster("Servicios AWS IA/ML"):
        textract = Textract("Textract")
        comprehend = Comprehend("Comprehend")
        sagemaker = Sagemaker("SageMaker")
    
    # Servicios de Notificación y Visualización
    with Cluster("Notificación y Visualización"):
        sns = SNS("SNS")
        ses = SES("SES")
        quicksight = Quicksight("QuickSight")
    
    # Servicios de Infraestructura
    with Cluster("Infraestructura y Seguridad"):
        cognito = Cognito("Cognito")
        secrets = SecretsManager("Secrets Manager")
        cloudwatch = Cloudwatch("CloudWatch")
        iam = Iam("IAM")
        kms = Kms("KMS")
    
    # Conexiones - Flujo principal
    Users("Internet") >> cloudfront
    cloudfront >> waf
    cloudfront >> shield
    cloudfront >> alb
    
    alb >> portal_cliente
    alb >> portal_analista
    alb >> portal_admin
    
    portal_cliente >> api_gateway
    portal_analista >> api_gateway
    portal_admin >> api_gateway
    
    # Conexiones API Gateway a Microservicios
    api_gateway >> cliente_service
    api_gateway >> formulario_service
    api_gateway >> documento_service
    api_gateway >> ocr_service
    api_gateway >> validacion_service
    api_gateway >> reglas_service
    api_gateway >> reporte_service
    api_gateway >> notificacion_service
    
    # Conexiones Microservicios a Bases de Datos
    cliente_service >> rds_postgres
    formulario_service >> rds_postgres
    documento_service >> dynamodb
    documento_service >> s3_storage
    ocr_service >> dynamodb
    validacion_service >> rds_postgres
    reporte_service >> rds_postgres
    
    # Conexiones Microservicios a Servicios AWS
    ocr_service >> textract
    ocr_service >> comprehend
    reglas_service >> sagemaker
    reglas_service >> redis
    notificacion_service >> sns
    notificacion_service >> ses
    reporte_service >> quicksight
    
    # Conexiones de Mensajería
    documento_service >> sqs
    ocr_service >> sqs
    validacion_service >> sqs
    reglas_service >> sqs
    sqs >> eventbridge
    eventbridge >> validacion_service
    eventbridge >> reglas_service
    eventbridge >> notificacion_service
    
    # Conexiones de Infraestructura
    api_gateway >> cognito
    cliente_service >> secrets
    formulario_service >> secrets
    documento_service >> secrets
    ocr_service >> secrets
    validacion_service >> secrets
    reglas_service >> secrets
    reporte_service >> secrets
    notificacion_service >> secrets
    
    # Monitoreo
    cliente_service >> cloudwatch
    formulario_service >> cloudwatch
    documento_service >> cloudwatch
    ocr_service >> cloudwatch
    validacion_service >> cloudwatch
    reglas_service >> cloudwatch
    reporte_service >> cloudwatch
    notificacion_service >> cloudwatch
    
    # Seguridad
    iam >> cliente_service
    iam >> formulario_service
    iam >> documento_service
    iam >> ocr_service
    iam >> validacion_service
    iam >> reglas_service
    iam >> reporte_service
    iam >> notificacion_service
    kms >> s3_storage

print("Diagrama generado exitosamente: sivd_architecture.png")

