import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthLayout } from './components/AuthLayout.tsx';
import { LoginForm } from './components/LoginForm.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';
import { ForgotPasswordModal } from './components/ForgotPasswordModal.tsx';
import type { AuthView, LoginFormData, RegisterFormData } from './types.ts';
import { Sparkles, Info, X } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Callback de inicio de sesión
  const handleLogin = async (data: LoginFormData) => {
    // Simulación de latencia de red (1.1s)
    await new Promise((resolve) => setTimeout(resolve, 1100));

    if (simulateError) {
      return { success: false, error: 'Credenciales incorrectas' };
    }

    showToast(`¡Hola de nuevo, ${data.email}! Cargando tu cesta y pedidos...`);
    return { success: true };
  };

  // Callback de registro
  const handleRegister = async (data: RegisterFormData) => {
    // Simulación de latencia de red (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (simulateError) {
      return { success: false, error: 'Este correo ya tiene una cuenta asociada en la tienda.' };
    }

    showToast(`¡Bienvenido al Club LUMEN, ${data.fullName}! Cupón NEW10 aplicado a tu cuenta.`);
    return { success: true };
  };

  // Callbacks para proveedores sociales
  const handleSocialAuth = (provider: 'Google' | 'Microsoft' | 'Apple') => {
    showToast(`Accediendo con ${provider}... Compra rápida con checkout seguro en un clic.`);
  };

  const isLogin = currentView === 'login';

  return (
    <div className="relative min-h-screen bg-[#FBFBFA] font-sans text-stone-900 antialiased flex flex-col justify-between selection:bg-zinc-900 selection:text-white">
      {/* Barra superior de anuncio e-commerce y control de prototipo */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 z-20 sticky top-0">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-stone-700">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full font-semibold bg-zinc-900 text-white text-[11px] tracking-wide">
              DEMO TIENDA
            </span>
            <span className="hidden sm:inline text-stone-500 font-medium">
              Prueba la experiencia de login/registro de una tienda de moda y diseño:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Selector de Disposición: Horizontal / Vertical */}
            <div className="inline-flex rounded-xl bg-stone-100 p-0.5 border border-stone-200" title="Cambiar disposición">
              <button
                type="button"
                id="layout-toggle-horizontal"
                onClick={() => setLayoutMode('horizontal')}
                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  layoutMode === 'horizontal'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-stone-500 hover:text-zinc-900'
                }`}
              >
                Horizontal
              </button>
              <button
                type="button"
                id="layout-toggle-vertical"
                onClick={() => setLayoutMode('vertical')}
                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  layoutMode === 'vertical'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-stone-500 hover:text-zinc-900'
                }`}
              >
                Vertical
              </button>
            </div>

            {/* Toggle de vista rápido */}
            <div className="inline-flex rounded-xl bg-stone-100 p-0.5 border border-stone-200">
              <button
                type="button"
                id="header-tab-login"
                onClick={() => setCurrentView('login')}
                className={`px-3 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  isLogin
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-stone-500 hover:text-zinc-900'
                }`}
              >
                Inicia sesión
              </button>
              <button
                type="button"
                id="header-tab-register"
                onClick={() => setCurrentView('register')}
                className={`px-3 py-1 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                  !isLogin
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-stone-500 hover:text-zinc-900'
                }`}
              >
                Crea cuenta
              </button>
            </div>

            {/* Switch para simular error de credenciales */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-stone-600 hover:text-zinc-900">
              <input
                type="checkbox"
                checked={simulateError}
                onChange={(e) => setSimulateError(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-stone-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
              />
              <span className="hidden sm:inline text-xs">Simular error</span>
              <span className="sm:hidden text-xs">Error</span>
            </label>
          </div>
        </div>
      </header>

      {/* Notificación flotante de eventos */}
      {toastMessage && (
        <div
          role="status"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-zinc-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-zinc-800 flex items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-0.5 rounded cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Contenedor principal con AuthLayout e-commerce */}
      <AuthLayout
        companyName="LUMEN Concept Store"
        title={isLogin ? 'Inicia sesión' : 'Crea tu cuenta'}
        subtitle={
          isLogin
            ? 'Accede a tus pedidos, lista de deseos y cesta guardada'
            : 'Únete para envíos express, drops exclusivos y 10% de bienvenida'
        }
        promoBadge="✨ 10% dto. de bienvenida en tu primera compra con tu cuenta"
        layoutMode={layoutMode}
        currentView={currentView}
        onSwitchView={(v) => setCurrentView(v)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isLogin ? (
            <motion.div
              key="login-form-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <LoginForm
                onLogin={handleLogin}
                onForgotPassword={() => setIsForgotModalOpen(true)}
                onSwitchToRegister={() => setCurrentView('register')}
                onLoginWithGoogle={() => handleSocialAuth('Google')}
                onLoginWithMicrosoft={() => handleSocialAuth('Microsoft')}
                onLoginWithApple={() => handleSocialAuth('Apple')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="register-form-view"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <RegisterForm
                onRegister={handleRegister}
                onSwitchToLogin={() => setCurrentView('login')}
                onRegisterWithGoogle={() => handleSocialAuth('Google')}
                onRegisterWithMicrosoft={() => handleSocialAuth('Microsoft')}
                onRegisterWithApple={() => handleSocialAuth('Apple')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthLayout>

      {/* Modal de recuperación de contraseña */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />

      {/* Barra inferior informativa accesible */}
      <aside className="w-full py-3 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5 px-4">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-stone-400" />
        <span>
          Diseñado para tiendas modernas: navegación por teclado, WCAG AA, y checkout preparado para alta conversión.
        </span>
      </aside>
    </div>
  );
}
