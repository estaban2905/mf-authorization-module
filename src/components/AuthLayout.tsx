import React from 'react';
import { ShoppingBag, Truck, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import storeEditorialImage from '../assets/images/store_editorial_1789693670511.jpg';

interface AuthLayoutProps {
  children: React.ReactNode;
  companyName?: string;
  logoUrl?: string;
  title: string;
  subtitle: string;
  termsUrl?: string;
  privacyUrl?: string;
  promoBadge?: string;
  layoutMode?: 'horizontal' | 'vertical';
  currentView?: 'login' | 'register';
  onSwitchView?: (view: 'login' | 'register') => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  companyName = 'LUMEN Concept Store',
  logoUrl,
  title,
  subtitle,
  termsUrl = '#terms',
  privacyUrl = '#privacy',
  promoBadge = '✨ 10% dto. de bienvenida en tu primera compra con tu cuenta',
  layoutMode = 'horizontal',
  currentView = 'login',
  onSwitchView,
}) => {
  const isHorizontal = layoutMode === 'horizontal';

  if (isHorizontal) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <main className="w-full max-w-5xl xl:max-w-5xl mx-auto bg-white rounded-3xl border border-stone-200/90 shadow-xl shadow-stone-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Panel Izquierdo: Editorial Showcase E-commerce */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-6 sm:p-9 bg-zinc-950 text-white overflow-hidden min-h-[300px] lg:min-h-[620px]">
            {/* Imagen de fondo editorial con overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={storeEditorialImage}
                alt="LUMEN Concept Store Editorial"
                className="w-full h-full object-cover object-center filter brightness-[0.68] contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
            </div>

            {/* Contenido superior del panel izquierdo */}
            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="h-6 w-6 rounded-full bg-white text-zinc-900 flex items-center justify-center">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold tracking-wider uppercase text-white/95">
                    {companyName}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-stone-300/80 uppercase tracking-widest">
                  FW · 2026
                </span>
              </div>

              {promoBadge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 backdrop-blur-md text-emerald-200 border border-emerald-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Código: <strong className="text-white">NEW10</strong></span>
                </div>
              )}
            </div>

            {/* Contenido central: Manifiesto de la tienda */}
            <div className="relative z-10 py-6 my-auto space-y-2.5">
              <span className="text-xs font-semibold tracking-widest uppercase text-stone-300">
                LIFESTYLE & DISEÑO
              </span>
              <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-snug">
                Piezas pensadas para acompañar tu día a día.
              </h2>
              <p className="text-xs sm:text-sm text-stone-300/90 leading-relaxed max-w-sm">
                Inicia sesión o crea tu cuenta para disfrutar de envíos prioritarios, guardar tus piezas favoritas y comprar en un clic.
              </p>
            </div>

            {/* Contenido inferior: Garantías de compra seguras */}
            <div className="relative z-10 border-t border-white/15 pt-5 mt-4 grid grid-cols-3 gap-2 text-stone-200">
              <div className="flex flex-col gap-1">
                <Truck className="w-4 h-4 text-stone-300" />
                <span className="text-[11px] font-medium leading-tight">Envíos express</span>
                <span className="text-[10px] text-stone-400">24/48h</span>
              </div>
              <div className="flex flex-col gap-1">
                <ShieldCheck className="w-4 h-4 text-stone-300" />
                <span className="text-[11px] font-medium leading-tight">Pago seguro</span>
                <span className="text-[10px] text-stone-400">SSL 256-bit</span>
              </div>
              <div className="flex flex-col gap-1">
                <RefreshCw className="w-4 h-4 text-stone-300" />
                <span className="text-[11px] font-medium leading-tight">Devoluciones</span>
                <span className="text-[10px] text-stone-400">30 días</span>
              </div>
            </div>
          </div>

          {/* Panel Derecho: Formulario de Autenticación */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Encabezado del formulario con switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-stone-100">
                <div>
                  <span className="block text-[11px] font-bold tracking-widest uppercase text-stone-400 mb-1">
                    {companyName}
                  </span>
                  <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900">
                    {title}
                  </h1>
                  <p className="mt-1 text-sm text-stone-500 leading-relaxed">
                    {subtitle}
                  </p>
                </div>

                {onSwitchView && (
                  <div className="inline-flex rounded-xl bg-stone-100 p-1 border border-stone-200 self-start">
                    <button
                      type="button"
                      id="tab-switch-login"
                      onClick={() => onSwitchView('login')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentView === 'login'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-stone-500 hover:text-zinc-900'
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      id="tab-switch-register"
                      onClick={() => onSwitchView('register')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        currentView === 'register'
                          ? 'bg-white text-zinc-900 shadow-xs'
                          : 'text-stone-500 hover:text-zinc-900'
                      }`}
                    >
                      Registro
                    </button>
                  </div>
                )}
              </div>

              {/* Formulario inyectado (LoginForm / RegisterForm) */}
              <div className="w-full">
                {children}
              </div>
            </div>

            {/* Pie de página legal */}
            <footer className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
              <div className="flex items-center space-x-3 text-[11px]">
                <a
                  href={termsUrl}
                  onClick={(e) => {
                    if (termsUrl === '#terms') e.preventDefault();
                  }}
                  className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors"
                >
                  Términos de la tienda
                </a>
                <span className="text-stone-300" aria-hidden="true">•</span>
                <a
                  href={privacyUrl}
                  onClick={(e) => {
                    if (privacyUrl === '#privacy') e.preventDefault();
                  }}
                  className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors"
                >
                  Privacidad
                </a>
              </div>
              <p className="text-[11px] text-stone-400">
                © {new Date().getFullYear()} {companyName}.
              </p>
            </footer>
          </div>
        </main>
      </div>
    );
  }

  // Modo Vertical Clásico (para alternar o vista compacta)
  return (
    <div className="min-h-screen w-full bg-[#FBFBFA] flex flex-col justify-center items-center px-4 py-8 sm:py-12 selection:bg-zinc-900 selection:text-white">
      <main className="w-full max-w-[420px] mx-auto">
        {promoBadge && (
          <div className="mb-4 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              {promoBadge}
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName}
                className="h-10 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="h-12 w-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-sm ring-4 ring-stone-200/70"
                aria-hidden="true"
              >
                <ShoppingBag className="w-6 h-6 text-stone-100 stroke-[1.75]" />
              </div>
            )}
          </div>
          <span className="block text-[11px] font-bold tracking-widest uppercase text-stone-500 mb-1">
            {companyName}
          </span>
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-zinc-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 sm:p-8">
          {children}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-500 border-t border-stone-200/60 pt-5">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-4 h-4 text-stone-600" />
            <span>Envíos express</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-stone-600" />
            <span>Pago protegido</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RefreshCw className="w-4 h-4 text-stone-600" />
            <span>Devolución 30 días</span>
          </div>
        </div>

        <footer className="mt-5 text-center text-xs text-stone-500 space-y-1.5">
          <div className="flex items-center justify-center space-x-3 text-stone-500">
            <a
              href={termsUrl}
              onClick={(e) => {
                if (termsUrl === '#terms') e.preventDefault();
              }}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors text-[11px]"
            >
              Términos de la tienda
            </a>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <a
              href={privacyUrl}
              onClick={(e) => {
                if (privacyUrl === '#privacy') e.preventDefault();
              }}
              className="hover:text-zinc-900 hover:underline underline-offset-4 transition-colors text-[11px]"
            >
              Política de privacidad
            </a>
          </div>
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} {companyName}. Todos los derechos reservados.
          </p>
        </footer>
      </main>
    </div>
  );
};
