import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export interface PasswordScore {
  score: number; // 0 to 4
  label: 'Débil' | 'Media' | 'Fuerte' | '';
  color: string;
  barWidthClass: string;
}

export function evaluatePasswordStrength(password: string): PasswordScore {
  if (!password) {
    return { score: 0, label: '', color: 'bg-stone-200', barWidthClass: 'w-0' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) {
    return {
      score: 1,
      label: 'Débil',
      color: 'bg-rose-500',
      barWidthClass: 'w-1/3',
    };
  } else if (score === 2 || score === 3) {
    return {
      score: 2,
      label: 'Media',
      color: 'bg-amber-500',
      barWidthClass: 'w-2/3',
    };
  } else {
    return {
      score: 3,
      label: 'Fuerte',
      color: 'bg-emerald-600',
      barWidthClass: 'w-full',
    };
  }
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const { label, color, score } = evaluatePasswordStrength(password);

  return (
    <div className="mt-2 space-y-1.5" aria-live="polite">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-medium text-stone-600">Seguridad:</span>
        <span
          className={`font-semibold transition-colors duration-200 ${
            score === 1
              ? 'text-rose-600'
              : score === 2
              ? 'text-amber-600'
              : 'text-emerald-700'
          }`}
        >
          {label}
        </span>
      </div>

      {/* Barra de 3 segmentos con separación visual */}
      <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full bg-transparent">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 1 ? color : 'bg-stone-200'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 2 ? color : 'bg-stone-200'
          }`}
        />
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            score >= 3 ? color : 'bg-stone-200'
          }`}
        />
      </div>

      <p className="text-[11px] text-stone-400 leading-tight">
        Mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos.
      </p>
    </div>
  );
};
