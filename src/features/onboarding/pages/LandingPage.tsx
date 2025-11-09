import { Link } from 'react-router-dom';
import { Check, Clock, Shield, FileText } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Bienvenido al Banco Andino</h1>
            <p className="text-xl mb-8 text-blue-100">
              Abre tu cuenta de forma rápida y segura desde cualquier lugar
            </p>
            <Link
              to="/register"
              className="btn-primary bg-white text-primary hover:bg-gray-100 inline-block"
            >
              Comenzar ahora
            </Link>
            <div className="mt-6">
              <Link to="/login" className="text-white hover:text-blue-100 underline">
                ¿Ya iniciaste? Ingresar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegir nuestro proceso digital?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Rápido</h3>
              <p className="text-gray-600">Completa tu proceso en menos de 15 minutos</p>
            </div>
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Seguro</h3>
              <p className="text-gray-600">
                Tus datos están protegidos con encriptación de nivel bancario
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Simple</h3>
              <p className="text-gray-600">Proceso intuitivo y guiado paso a paso</p>
            </div>
            <div className="text-center">
              <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Validación Inteligente</h3>
              <p className="text-gray-600">Verificación automática de documentos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Requisitos para abrir tu cuenta</h2>
            <div className="bg-white rounded-lg shadow-md p-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <span>Ser mayor de 18 años</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <span>Cédula de ciudadanía o pasaporte vigente</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <span>Comprobante de ingresos (últimos 3 meses)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <span>Comprobante de domicilio (últimos 3 meses)</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <span>Email y teléfono activos</span>
                </li>
              </ul>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-600 text-center">
                  <Clock className="w-5 h-5 inline mr-2" />
                  Tiempo estimado: 10-15 minutos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">© 2024 Banco Andino. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <Link to="/terms" className="hover:text-blue-300">
                Términos y Condiciones
              </Link>
              <Link to="/privacy" className="hover:text-blue-300">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
