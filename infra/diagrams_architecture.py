from diagrams import Diagram, Cluster
from diagrams.aws.security import Cognito
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway
from diagrams.aws.storage import S3
from diagrams.aws.database import Dynamodb
from diagrams.aws.integration import SQS, SNS
from diagrams.aws.management import Cloudwatch
from diagrams.aws.ml import Rekognition, Comprehend, Sagemaker

with Diagram("Banco Andino Onboarding Architecture", show=False):
    with Cluster("Cliente & Ingreso"):
        client = Cognito("Auth (Cognito)")
        api = APIGateway("API Gateway")

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
        queue = SQS("SQS")
        notify = SNS("SNS")

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
    cw << orchestrator