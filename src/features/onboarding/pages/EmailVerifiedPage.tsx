import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { CheckCircle, Loader } from 'lucide-react';
import { authService } from '../services/authService';

export const EmailVerifiedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setErrorMessage('Token de verificación no encontrado');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: unknown) {
        const axiosError = error as AxiosError<{ error?: { message?: string } }>;
        setStatus('error');
        setErrorMessage(
          axiosError.response?.data?.error?.message ||
            'Error al verificar el email. El enlace puede haber expirado.'
        );
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando tu email...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="bg-error/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-error">Error en la verificación</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <button onClick={() => navigate('/login')} className="btn-primary">
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Email verificado exitosamente!</h2>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido verificada. Serás redirigido al inicio de sesión en unos segundos.
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
