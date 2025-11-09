from diagrams import Diagram, Cluster
from diagrams.aws.security import Cognito, Kms
from diagrams.aws.compute import Lambda
from diagrams.aws.network import Apigateway
from diagrams.aws.storage import S3
from diagrams.aws.database import Dynamodb
from diagrams.aws.analytics import Sqs, Sns
from diagrams.aws.management import Cloudwatch, Iam
from diagrams.aws.ml import Rekognition, Comprehend, Sagemaker

with Diagram("Banco Andino Onboarding Architecture", show=False):
    with Cluster("Cliente & Ingreso"):
        client = Cognito("Auth (Cognito)")
        api = Apigateway("API Gateway")

    with Cluster("Storage"):
        s3 = S3("S3 - documentos")
        db = Dynamodb("DynamoDB - formularios/resultados")

    with Cluster("Procesamiento Inteligente"):
        ocr = Rekognition("Rekognition/Textract")
        nlp = Comprehend("Comprehend")
        model = Sagemaker("SageMaker")
        compare = Lambda("Comparador (Lambda)")
        orchestrator = Lambda("Orquestador (Lambda)")

    with Cluster("Reportes & Alertas"):
        report = Lambda("Generador de reportes")
        queue = Sqs("SQS")
        notify = Sns("SNS")

    security = Iam("IAM")
    kms = Kms("KMS")
    cw = Cloudwatch("CloudWatch")

    client >> api >> orchestrator
    api >> s3
    orchestrator >> ocr
    orchestrator >> nlp
    ocr >> compare
    nlp >> compare
    compare >> model
    compare >> db
    orchestrator >> report >> notify
    notify >> queue
    security - orchestrator
    kms - s3
    cw << orchestrator
