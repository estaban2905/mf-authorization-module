import React, { useState } from 'react';
import { X, Mail, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (val: string) => {
    if (!val.trim()) return 'El correo electrónico es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Ingresa un correo electrónico válido';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setIsSubmitting(true);

    // Simulación de envío
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setEmail('');
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-3 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 id="forgot-password-title" className="text-lg font-semibold text-zinc-900">
                Enlace de recuperación enviado
              </h3>
              <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
                Hemos enviado un correo a <span className="font-medium text-zinc-900">{email}</span> con las instrucciones para restablecer tu contraseña y recuperar el acceso a tus pedidos y cesta.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="w-full h-11 px-4 bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 cursor-pointer"
            >
              Volver a la tienda
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <h3 id="forgot-password-title" className="text-lg font-semibold text-zinc-900">
                Recupera tu cuenta
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                Ingresa tu correo electrónico registrado para recuperar el acceso a tus pedidos y beneficios de la tienda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="forgot-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Correo de tu cuenta
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="tu.email@ejemplo.com"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'forgot-email-error' : undefined}
                    disabled={isSubmitting}
                    className={`w-full h-11 pl-10 pr-3.5 bg-white border text-sm text-stone-900 rounded-xl placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
                      error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                        : 'border-stone-300 focus:border-zinc-900 focus:ring-zinc-900/10'
                    }`}
                  />
                </div>
                {error && (
                  <p id="forgot-email-error" className="mt-1.5 text-xs text-rose-600 font-medium">
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-stone-300 text-white text-sm font-medium rounded-xl flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      <span>Enviando enlace...</span>
                    </>
                  ) : (
                    'Enviar enlace de recuperación'
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="w-full h-10 px-4 text-stone-600 hover:text-zinc-900 text-sm font-medium rounded-xl inline-flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Cancelar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
