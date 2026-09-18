import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { SocialButtons } from './SocialButtons.tsx';
import type { LoginFormData, LoginFormProps } from '../types.ts';

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onForgotPassword,
  onSwitchToRegister,
  onLoginWithGoogle,
  onLoginWithMicrosoft,
  onLoginWithApple,
  isLoading = false,
}) => {
  // Estado local de los campos del formulario
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Visibilidad de contraseña
  const [showPassword, setShowPassword] = useState(false);

  // Errores inline y error general
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Feedback de éxito
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [internalLoading, setInternalLoading] = useState(false);

  const activeLoading = isLoading || internalLoading;

  // Validación básica de email
  const validateEmail = (emailStr: string): string => {
    if (!emailStr.trim()) {
      return 'El correo electrónico es requerido';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr.trim())) {
      return 'Ingresa un formato de correo válido';
    }
    return '';
  };

  // Validación básica de contraseña
  const validatePassword = (passStr: string): string => {
    if (!passStr) {
      return 'La contraseña es requerida';
    }
    if (passStr.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  };

  // Validación al salir del campo (onBlur)
  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(formData.email);
      setErrors((prev) => ({ ...prev, email: err, general: undefined }));
    } else if (field === 'password') {
      const err = validatePassword(formData.password);
      setErrors((prev) => ({ ...prev, password: err, general: undefined }));
    }
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores a medida que el usuario escribe si ya estaba marcado como tocado
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
    if (field === 'email' && touched.email) {
      const err = validateEmail(value as string);
      setErrors((prev) => ({ ...prev, email: err }));
    }
    if (field === 'password' && touched.password) {
      const err = validatePassword(value as string);
      setErrors((prev) => ({ ...prev, password: err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevenir doble envío si ya está cargando
    if (activeLoading) return;

    // Validar todos los campos antes de enviar
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setErrors({});
    setSuccessMessage('');
    setInternalLoading(true);

    try {
      if (onLogin) {
        const res = await onLogin(formData);
        if (res && !res.success) {
          setErrors({ general: res.error || 'Credenciales incorrectas' });
          setInternalLoading(false);
          return;
        }
      }
      // Mensaje de éxito de tienda moderna
      setSuccessMessage('Sesión iniciada. Cargando tu carrito y pedidos...');
    } catch {
      setErrors({ general: 'Credenciales incorrectas' });
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Mensaje de éxito */}
      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center space-x-3 text-emerald-800 text-sm font-medium animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Mensaje de error general (seguridad: no revela detalles sensibles) */}
      {errors.general && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start space-x-3 text-rose-800 text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-xs uppercase tracking-wider text-rose-900">Credenciales incorrectas</span>
            <span className="text-xs text-rose-700">Verifica tu correo o contraseña e inténtalo de nuevo.</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Campo: Email */}
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              type="email"
              name="email"
              autoComplete="email"
              required
              disabled={activeLoading}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              placeholder="tu.email@ejemplo.com"
              aria-invalid={touched.email && !!errors.email}
              aria-describedby={touched.email && errors.email ? 'login-email-error' : undefined}
              className={`w-full h-11 pl-10 pr-3.5 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.email && errors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p id="login-email-error" className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Campo: Contraseña */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-stone-700"
            >
              Contraseña
            </label>
            <a
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                if (onForgotPassword) {
                  onForgotPassword();
                }
              }}
              className="text-xs font-medium text-stone-600 hover:text-zinc-900 hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              required
              disabled={activeLoading}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="••••••••"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={touched.password && errors.password ? 'login-password-error' : undefined}
              className={`w-full h-11 pl-10 pr-10 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.password && errors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
            {/* Botón para alternar visibilidad de contraseña */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={activeLoading}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none focus:text-zinc-900 disabled:cursor-not-allowed"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p id="login-password-error" className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}
        </div>

        {/* Checkbox: Recordarme */}
        <div className="flex items-center pt-0.5">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            disabled={activeLoading}
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-zinc-900 focus:ring-zinc-900/20 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-stone-600 select-none cursor-pointer">
            Recordarme para comprar más rápido
          </label>
        </div>

        {/* Botón principal: Iniciar sesión */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-login-submit"
            disabled={activeLoading}
            className="w-full h-11 px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black disabled:bg-stone-300 text-white font-medium text-sm rounded-xl flex items-center justify-center transition-all shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer"
          >
            {activeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Iniciando sesión...</span>
              </>
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </div>

        {/* Separador visual */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-stone-400 font-medium">O continúa con</span>
          </div>
        </div>

        {/* Botones de inicio de sesión social */}
        <SocialButtons
          onGoogle={onLoginWithGoogle}
          onMicrosoft={onLoginWithMicrosoft}
          onApple={onLoginWithApple}
          disabled={activeLoading}
          actionLabel="con"
        />

        {/* Enlace para alternar a Registro con incentivo e-commerce */}
        <div className="pt-4 text-center border-t border-stone-100">
          <p className="text-sm text-stone-600">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              id="link-switch-to-register"
              onClick={onSwitchToRegister}
              disabled={activeLoading}
              className="font-semibold text-zinc-900 hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              Regístrate y obtén 10% dto.
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
