import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { Eye, EyeOff } from 'lucide-react';

const registerSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email requerido'),
  password: yup
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .matches(/[A-Z]/, 'Requiere al menos una mayúscula')
    .matches(/[a-z]/, 'Requiere al menos una minúscula')
    .matches(/[0-9]/, 'Requiere al menos un número')
    .required('Contraseña requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
  telefono: yup
    .string()
    .matches(/^\+57[0-9]{10}$/, 'Formato: +57XXXXXXXXXX')
    .required('Teléfono requerido'),
  termsAccepted: yup.boolean().oneOf([true], 'Debes aceptar los términos y condiciones').required(),
});

type RegisterFormData = yup.InferType<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register({
        email: data.email,
        password: data.password,
        telefono: data.telefono,
        termsAccepted: data.termsAccepted,
      });
      navigate('/email-sent', { state: { email: data.email } });
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: { message?: string } }>;
      setError(
        axiosError.response?.data?.error?.message ||
          'Error al registrar. Por favor intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear cuenta nueva
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            O{' '}
            <a href="/login" className="font-medium text-primary hover:text-primary-dark">
              inicia sesión si ya tienes cuenta
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
                className={`input-field mt-1 ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="mt-1 text-sm text-error">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                placeholder="+57XXXXXXXXXX"
                className={`input-field mt-1 ${errors.telefono ? 'input-error' : ''}`}
                {...register('telefono')}
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-error">{errors.telefono.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="relative mt-1">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                id="termsAccepted"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                {...register('termsAccepted')}
              />
              <label htmlFor="termsAccepted" className="ml-2 block text-sm text-gray-700">
                Acepto los{' '}
                <a href="/terms" className="text-primary hover:text-primary-dark">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href="/privacy" className="text-primary hover:text-primary-dark">
                  política de privacidad
                </a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-error">{errors.termsAccepted.message}</p>
            )}
          </div>

          <div>
            <button type="submit" disabled={!isValid || isLoading} className="btn-primary w-full">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
