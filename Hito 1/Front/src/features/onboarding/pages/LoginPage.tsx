import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup.string().required('Contraseña requerida'),
  rememberMe: yup.boolean(),
});

type LoginFormData = yup.InferType<typeof loginSchema>;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      if (response.data?.cliente) {
        // Redirect based on onboarding status
        const status = response.data.cliente.estadoOnboarding;
        const routes: Record<string, string> = {
          REGISTRO_COMPLETADO: '/onboarding/personal-info',
          FORMULARIO_COMPLETADO: '/onboarding/documents',
          DOCUMENTOS_CARGADOS: '/onboarding/status',
          VALIDACION_COMPLETADA: '/dashboard',
        };
        navigate(routes[status] || '/onboarding');
      } else {
        navigate('/onboarding');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: { message?: string } }>;
      setError(
        axiosError.response?.data?.error?.message ||
          'Credenciales incorrectas. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a href="/register" className="font-medium text-primary hover:text-primary-dark">
              crea una cuenta nueva
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                className={`input-field mt-1 ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  {...register('rememberMe')}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Recordar mi sesión
                </label>
              </div>
              <div className="text-sm">
                <a href="/forgot-password" className="text-primary hover:text-primary-dark">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
