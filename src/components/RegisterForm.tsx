import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { SocialButtons } from './SocialButtons.tsx';
import { PasswordStrengthMeter, evaluatePasswordStrength } from './PasswordStrengthMeter.tsx';
import type { RegisterFormData, RegisterFormProps } from '../types.ts';

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onSwitchToLogin,
  onRegisterWithGoogle,
  onRegisterWithMicrosoft,
  onRegisterWithApple,
  termsUrl = '#terms',
  privacyUrl = '#privacy',
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    receiveUpdates: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
    general?: string;
  }>({});

  const [touched, setTouched] = useState<{
    fullName?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    acceptTerms?: boolean;
  }>({});

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [internalLoading, setInternalLoading] = useState(false);

  const activeLoading = isLoading || internalLoading;

  // Validaciones
  const validateFullName = (name: string): string => {
    if (!name.trim()) return 'El nombre completo es requerido';
    if (name.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return '';
  };

  const validateEmail = (emailStr: string): string => {
    if (!emailStr.trim()) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr.trim())) return 'Ingresa un formato de correo válido';
    return '';
  };

  const validatePassword = (pass: string): string => {
    if (!pass) return 'La contraseña es requerida';
    if (pass.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
    const strength = evaluatePasswordStrength(pass);
    if (strength.score < 2) {
      return 'Incluye mayúsculas, minúsculas, números o caracteres especiales';
    }
    return '';
  };

  const validateConfirmPassword = (confirm: string, pass: string): string => {
    if (!confirm) return 'Por favor confirma tu contraseña';
    if (confirm !== pass) return 'Las contraseñas no coinciden';
    return '';
  };

  const validateTerms = (accepted: boolean): string => {
    if (!accepted) return 'Debes aceptar los Términos y la Política de Privacidad';
    return '';
  };

  const handleBlur = (field: 'fullName' | 'email' | 'password' | 'confirmPassword' | 'acceptTerms') => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'fullName') {
      setErrors((prev) => ({ ...prev, fullName: validateFullName(formData.fullName) }));
    } else if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(formData.email) }));
    } else if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(formData.password) }));
      if (touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
        }));
      }
    } else if (field === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password),
      }));
    } else if (field === 'acceptTerms') {
      setErrors((prev) => ({ ...prev, acceptTerms: validateTerms(formData.acceptTerms) }));
    }
  };

  const handleInputChange = (field: keyof RegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }

    // Validación interactiva mientras escribe
    if (field === 'fullName' && touched.fullName) {
      setErrors((prev) => ({ ...prev, fullName: validateFullName(value as string) }));
    }
    if (field === 'email' && touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value as string) }));
    }
    if (field === 'password') {
      if (touched.password) {
        setErrors((prev) => ({ ...prev, password: validatePassword(value as string) }));
      }
      if (touched.confirmPassword && formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(formData.confirmPassword, value as string),
        }));
      }
    }
    if (field === 'confirmPassword' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value as string, formData.password),
      }));
    }
    if (field === 'acceptTerms' && touched.acceptTerms) {
      setErrors((prev) => ({ ...prev, acceptTerms: validateTerms(value as boolean) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeLoading) return;

    const nameErr = validateFullName(formData.fullName);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.confirmPassword, formData.password);
    const termsErr = validateTerms(formData.acceptTerms);

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });

    if (nameErr || emailErr || passErr || confirmErr || termsErr) {
      setErrors({
        fullName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
        acceptTerms: termsErr,
      });
      return;
    }

    setErrors({});
    setSuccessMessage('');
    setInternalLoading(true);

    try {
      if (onRegister) {
        const res = await onRegister(formData);
        if (res && !res.success) {
          setErrors({ general: res.error || 'No se pudo crear la cuenta' });
          setInternalLoading(false);
          return;
        }
      }
      setSuccessMessage('¡Bienvenido al Club! Tu cuenta ha sido creada. Revisa tu email para activar tu 10% de descuento.');
    } catch {
      setErrors({ general: 'Ocurrió un error al procesar el registro. Intenta nuevamente.' });
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
          className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-start space-x-3 text-emerald-800 text-sm font-medium animate-in fade-in"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-emerald-950">¡Registro exitoso!</span>
            <span className="text-xs text-emerald-800">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error general */}
      {errors.general && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3.5 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start space-x-3 text-rose-800 text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-xs uppercase tracking-wider text-rose-900">Error al registrar</span>
            <span className="text-xs text-rose-700">{errors.general}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        {/* Campo: Nombre completo */}
        <div>
          <label
            htmlFor="register-fullname"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
          >
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-fullname"
              type="text"
              name="fullName"
              autoComplete="name"
              required
              disabled={activeLoading}
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="Tu nombre y apellido"
              aria-invalid={touched.fullName && !!errors.fullName}
              aria-describedby={touched.fullName && errors.fullName ? 'register-name-error' : undefined}
              className={`w-full h-11 pl-10 pr-3.5 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.fullName && errors.fullName
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
          </div>
          {touched.fullName && errors.fullName && (
            <p id="register-name-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.fullName}</span>
            </p>
          )}
        </div>

        {/* Campo: Email */}
        <div>
          <label
            htmlFor="register-email"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
          >
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
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
              aria-describedby={touched.email && errors.email ? 'register-email-error' : undefined}
              className={`w-full h-11 pl-10 pr-3.5 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.email && errors.email
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
          </div>
          {touched.email && errors.email && (
            <p id="register-email-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        {/* Campo: Contraseña */}
        <div>
          <label
            htmlFor="register-password"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
          >
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              required
              disabled={activeLoading}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Mínimo 8 caracteres"
              aria-invalid={touched.password && !!errors.password}
              aria-describedby={touched.password && errors.password ? 'register-password-error' : undefined}
              className={`w-full h-11 pl-10 pr-10 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.password && errors.password
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
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
            <p id="register-password-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.password}</span>
            </p>
          )}

          {/* Indicador de fortaleza */}
          <PasswordStrengthMeter password={formData.password} />
        </div>

        {/* Campo: Confirmar Contraseña */}
        <div>
          <label
            htmlFor="register-confirm-password"
            className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1"
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              autoComplete="new-password"
              required
              disabled={activeLoading}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              onBlur={() => handleBlur('confirmPassword')}
              placeholder="Repite tu contraseña"
              aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
              aria-describedby={touched.confirmPassword && errors.confirmPassword ? 'register-confirm-error' : undefined}
              className={`w-full h-11 pl-10 pr-10 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed ${
                touched.confirmPassword && errors.confirmPassword
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={activeLoading}
              aria-label={showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none focus:text-zinc-900 disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <p id="register-confirm-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.confirmPassword}</span>
            </p>
          )}
        </div>

        {/* Checkbox obligatorio: Acepto los Términos y la Política de Privacidad */}
        <div className="pt-1">
          <div className="flex items-start">
            <input
              id="register-terms"
              name="acceptTerms"
              type="checkbox"
              required
              disabled={activeLoading}
              checked={formData.acceptTerms}
              onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
              onBlur={() => handleBlur('acceptTerms')}
              aria-invalid={touched.acceptTerms && !!errors.acceptTerms}
              aria-describedby={touched.acceptTerms && errors.acceptTerms ? 'register-terms-error' : undefined}
              className="mt-0.5 h-4 w-4 rounded border-stone-300 text-zinc-900 focus:ring-zinc-900/20 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <label htmlFor="register-terms" className="ml-2.5 block text-xs text-stone-600 leading-snug cursor-pointer select-none">
              Acepto los{' '}
              <a
                href={termsUrl}
                onClick={(e) => {
                  if (termsUrl === '#terms') e.preventDefault();
                }}
                className="text-stone-900 font-semibold hover:underline underline-offset-2"
              >
                Términos
              </a>{' '}
              y la{' '}
              <a
                href={privacyUrl}
                onClick={(e) => {
                  if (privacyUrl === '#privacy') e.preventDefault();
                }}
                className="text-stone-900 font-semibold hover:underline underline-offset-2"
              >
                Política de Privacidad
              </a>
            </label>
          </div>
          {touched.acceptTerms && errors.acceptTerms && (
            <p id="register-terms-error" className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1 pl-6.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errors.acceptTerms}</span>
            </p>
          )}
        </div>

        {/* Checkbox opcional: Novedades con beneficio e-commerce */}
        <div className="flex items-center">
          <input
            id="register-updates"
            name="receiveUpdates"
            type="checkbox"
            disabled={activeLoading}
            checked={formData.receiveUpdates}
            onChange={(e) => handleInputChange('receiveUpdates', e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-zinc-900 focus:ring-zinc-900/20 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="register-updates" className="ml-2.5 block text-xs text-stone-600 cursor-pointer select-none">
            Quiero recibir drops exclusivos y ofertas de miembros
          </label>
        </div>

        {/* Botón principal: Crear cuenta */}
        <div className="pt-2">
          <button
            type="submit"
            id="btn-register-submit"
            disabled={activeLoading}
            className="w-full h-11 px-4 bg-zinc-900 hover:bg-zinc-800 active:bg-black disabled:bg-stone-300 text-white font-medium text-sm rounded-xl flex items-center justify-center transition-all shadow-xs hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:cursor-not-allowed cursor-pointer"
          >
            {activeLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Creando tu cuenta...</span>
              </>
            ) : (
              'Crear cuenta y unirme'
            )}
          </button>
        </div>

        {/* Separador visual */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-white px-3 text-stone-400 font-medium">O regístrate con</span>
          </div>
        </div>

        {/* Botones sociales */}
        <SocialButtons
          onGoogle={onRegisterWithGoogle}
          onMicrosoft={onRegisterWithMicrosoft}
          onApple={onRegisterWithApple}
          disabled={activeLoading}
          actionLabel="con"
        />

        {/* Enlace para alternar a Login */}
        <div className="pt-4 text-center border-t border-stone-100">
          <p className="text-sm text-stone-600">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              id="link-switch-to-login"
              onClick={onSwitchToLogin}
              disabled={activeLoading}
              className="font-semibold text-zinc-900 hover:underline underline-offset-4 focus:outline-none focus:ring-1 focus:ring-zinc-900 rounded transition-colors disabled:opacity-50 cursor-pointer"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
