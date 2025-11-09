import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

type EmailSentLocationState = {
  email?: string;
};

export const EmailSentPage = () => {
  const location = useLocation<EmailSentLocationState>();
  const navigate = useNavigate();
  const email = location.state?.email ?? '';
  const [countdown, setCountdown] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email || !canResend) return;

    setIsResending(true);
    try {
      await authService.resendVerificationEmail(email);
      setResendSuccess(true);
      setCountdown(120);
      setCanResend(false);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error) {
      console.error('Error al reenviar email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Verifica tu email</h2>
          <p className="text-gray-600 mb-6">Hemos enviado un enlace de verificación a:</p>
          <p className="font-semibold text-primary mb-6">{email}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Por favor revisa tu bandeja de entrada y la carpeta de spam. Haz clic en el enlace
              para verificar tu cuenta.
            </p>
          </div>

          {resendSuccess && (
            <div className="bg-success/10 border border-success text-success px-4 py-3 rounded-lg mb-4 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Email reenviado exitosamente
            </div>
          )}

          <div className="space-y-4">
            {!canResend ? (
              <p className="text-sm text-gray-600">
                Puedes reenviar el email en {formatTime(countdown)}
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="btn-secondary w-full"
              >
                {isResending ? 'Reenviando...' : 'Reenviar email'}
              </button>
            )}

            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-dark text-sm"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
