import React from 'react';

import {
  Cloud,
  Database,
  Shield,
  Zap,
  FileText,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  Lock,
  Globe,
} from 'lucide-react';

export default function SIVDArchitecture() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Arquitectura SIVD - Banco Andino</h1>

          <p className="text-blue-200 text-lg">
            Sistema Inteligente de Validación Documental en AWS
          </p>
        </div>

        {/* Internet Layer */}

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 mb-6 border border-purple-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-purple-300" size={28} />

            <h2 className="text-2xl font-bold text-white">Capa de Internet</h2>
          </div>

          <div className="flex gap-4 justify-center">
            <div className="bg-purple-600/30 p-4 rounded-lg border border-purple-400/50 text-center">
              <Shield className="text-purple-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold">AWS WAF</p>

              <p className="text-purple-200 text-sm">Firewall de Aplicaciones</p>
            </div>

            <div className="bg-purple-600/30 p-4 rounded-lg border border-purple-400/50 text-center">
              <Zap className="text-purple-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold">Amazon CloudFront</p>

              <p className="text-purple-200 text-sm">CDN Global</p>
            </div>

            <div className="bg-purple-600/30 p-4 rounded-lg border border-purple-400/50 text-center">
              <Lock className="text-purple-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold">AWS Shield</p>

              <p className="text-purple-200 text-sm">Protección DDoS</p>
            </div>
          </div>
        </div>

        {/* Load Balancer Layer */}

        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-6 mb-6 border border-blue-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="text-blue-300" size={28} />

            <h2 className="text-2xl font-bold text-white">Balanceo de Carga</h2>
          </div>

          <div className="flex gap-4 justify-center">
            <div className="bg-blue-600/30 p-4 rounded-lg border border-blue-400/50 text-center">
              <div className="text-white font-semibold text-lg mb-2">Application Load Balancer</div>

              <p className="text-blue-200 text-sm">Distribución de tráfico entre microservicios</p>
            </div>
          </div>
        </div>

        {/* Frontend Layer */}

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 mb-6 border border-green-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-green-300" size={28} />

            <h2 className="text-2xl font-bold text-white">Capa de Presentación</h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-600/30 p-4 rounded-lg border border-green-400/50">
              <Users className="text-green-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold text-center">Portal Cliente</p>

              <p className="text-green-200 text-sm text-center mt-2">React + S3</p>

              <p className="text-green-300 text-xs text-center mt-1">Onboarding digital</p>
            </div>

            <div className="bg-green-600/30 p-4 rounded-lg border border-green-400/50">
              <BarChart3 className="text-green-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold text-center">Portal Analista</p>

              <p className="text-green-200 text-sm text-center mt-2">React + S3</p>

              <p className="text-green-300 text-xs text-center mt-1">Revisión y gestión</p>
            </div>

            <div className="bg-green-600/30 p-4 rounded-lg border border-green-400/50">
              <Shield className="text-green-300 mx-auto mb-2" size={32} />

              <p className="text-white font-semibold text-center">Portal Admin</p>

              <p className="text-green-200 text-sm text-center mt-2">React + S3</p>

              <p className="text-green-300 text-xs text-center mt-1">Configuración</p>
            </div>
          </div>
        </div>

        {/* API Gateway */}

        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 mb-6 border border-yellow-400/30">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="text-yellow-300" size={24} />

            <h3 className="text-xl font-bold text-white">Amazon API Gateway</h3>

            <p className="text-yellow-200 text-sm">(REST + WebSocket APIs)</p>
          </div>
        </div>

        {/* Microservices Layer */}

        <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg p-6 mb-6 border border-indigo-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="text-indigo-300" size={28} />

            <h2 className="text-2xl font-bold text-white">Capa de Microservicios (ECS Fargate)</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Cliente Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <Users className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Cliente Service</p>

              <p className="text-indigo-200 text-xs mb-2">Node.js/Express</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">RDS PostgreSQL</span>
              </div>
            </div>

            {/* Formulario Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <FileText className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Formulario Service</p>

              <p className="text-indigo-200 text-xs mb-2">Node.js/Express</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">RDS PostgreSQL</span>
              </div>
            </div>

            {/* Documento Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <FileText className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Documento Service</p>

              <p className="text-indigo-200 text-xs mb-2">Python/FastAPI</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">DynamoDB</span>
              </div>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Cloud className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">S3 (archivos)</span>
              </div>
            </div>

            {/* OCR/IDP Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <AlertCircle className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">OCR/IDP Service</p>

              <p className="text-indigo-200 text-xs mb-2">Python/FastAPI</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Cloud className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">Textract + Comprehend</span>
              </div>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">DynamoDB</span>
              </div>
            </div>

            {/* Validación Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <CheckCircle className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Validación Service</p>

              <p className="text-indigo-200 text-xs mb-2">Python/FastAPI</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">RDS PostgreSQL</span>
              </div>
            </div>

            {/* Reglas/IA Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <Zap className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Reglas/IA Service</p>

              <p className="text-indigo-200 text-xs mb-2">Python/FastAPI</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Cloud className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">SageMaker</span>
              </div>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">ElastiCache Redis</span>
              </div>
            </div>

            {/* Reporte Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <BarChart3 className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Reporte Service</p>

              <p className="text-indigo-200 text-xs mb-2">Node.js/Express</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Database className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">RDS PostgreSQL</span>
              </div>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Cloud className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">QuickSight</span>
              </div>
            </div>

            {/* Notificación Service */}

            <div className="bg-indigo-600/30 p-4 rounded-lg border border-indigo-400/50">
              <AlertCircle className="text-indigo-300 mb-2" size={28} />

              <p className="text-white font-semibold mb-1">Notificación Service</p>

              <p className="text-indigo-200 text-xs mb-2">Node.js/Express</p>

              <div className="bg-indigo-700/40 p-2 rounded mt-2">
                <Cloud className="text-indigo-300 inline mr-1" size={16} />

                <span className="text-indigo-200 text-xs">SNS + SES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messaging Layer */}

        <div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg p-4 mb-6 border border-pink-400/30">
          <div className="flex items-center justify-center gap-3">
            <Zap className="text-pink-300" size={24} />

            <h3 className="text-xl font-bold text-white">Amazon SQS / EventBridge</h3>

            <p className="text-pink-200 text-sm">(Comunicación asíncrona entre servicios)</p>
          </div>
        </div>

        {/* Infrastructure Services */}

        <div className="bg-gradient-to-r from-slate-500/20 to-gray-500/20 rounded-lg p-6 border border-slate-400/30">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-slate-300" size={28} />

            <h2 className="text-2xl font-bold text-white">Servicios de Infraestructura</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-600/30 p-3 rounded-lg border border-slate-400/50 text-center">
              <Lock className="text-slate-300 mx-auto mb-1" size={24} />

              <p className="text-white font-semibold text-sm">AWS Cognito</p>

              <p className="text-slate-300 text-xs">Autenticación</p>
            </div>

            <div className="bg-slate-600/30 p-3 rounded-lg border border-slate-400/50 text-center">
              <Shield className="text-slate-300 mx-auto mb-1" size={24} />

              <p className="text-white font-semibold text-sm">AWS Secrets Manager</p>

              <p className="text-slate-300 text-xs">Gestión secretos</p>
            </div>

            <div className="bg-slate-600/30 p-3 rounded-lg border border-slate-400/50 text-center">
              <BarChart3 className="text-slate-300 mx-auto mb-1" size={24} />

              <p className="text-white font-semibold text-sm">CloudWatch</p>

              <p className="text-slate-300 text-xs">Monitoreo/Logs</p>
            </div>

            <div className="bg-slate-600/30 p-3 rounded-lg border border-slate-400/50 text-center">
              <AlertCircle className="text-slate-300 mx-auto mb-1" size={24} />

              <p className="text-white font-semibold text-sm">X-Ray</p>

              <p className="text-slate-300 text-xs">Trazabilidad</p>
            </div>
          </div>
        </div>

        {/* Architecture Notes */}

        <div className="mt-6 bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
          <h3 className="text-white font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="text-blue-300" size={20} />
            Características Clave de la Arquitectura
          </h3>

          <ul className="text-blue-200 text-sm space-y-1">
            <li>
              • <strong>Alta Disponibilidad:</strong> Multi-AZ deployment con Auto Scaling
            </li>

            <li>
              • <strong>Escalabilidad:</strong> ECS Fargate con escalado automático basado en
              métricas
            </li>

            <li>
              • <strong>Seguridad:</strong> VPC aislada, Cognito, Secrets Manager, WAF + Shield
            </li>

            <li>
              • <strong>Rendimiento:</strong> CloudFront CDN, ElastiCache Redis, balanceo de carga
            </li>

            <li>
              • <strong>Observabilidad:</strong> CloudWatch + X-Ray para monitoreo completo
            </li>

            <li>
              • <strong>Desacoplamiento:</strong> SQS/EventBridge para comunicación asíncrona
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
