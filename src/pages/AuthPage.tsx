import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, ArrowRight, CheckCircle, Leaf, ArrowLeft } from 'lucide-react';

type Mode = 'login' | 'register' | 'forgot';

const ERROR_MAP: Record<string, string> = {
  'Invalid login credentials':     'Correo o contraseña incorrectos.',
  'Email not confirmed':           'Confirma tu correo antes de entrar.',
  'User already registered':       'Ese correo ya tiene una cuenta. Inicia sesión.',
  'already registered':            'Ese correo ya tiene una cuenta. Inicia sesión.',
  'already been registered':       'Ese correo ya tiene una cuenta. Inicia sesión.',
  'Email address already':         'Ese correo ya tiene una cuenta. Inicia sesión.',
  'Password should be at least 6': 'La contraseña debe tener al menos 6 caracteres.',
  'Unable to validate email':      'Correo electrónico inválido.',
  'signup_disabled':               'El registro está desactivado.',
  'Email rate limit':              'Demasiados intentos. Espera unos minutos.',
  'over_email_send_rate_limit':    'Demasiados intentos. Espera unos minutos.',
  'For security purposes':         'Por seguridad, espera unos segundos antes de intentar nuevamente.',
};

function mapError(msg: string) {
  for (const [key, val] of Object.entries(ERROR_MAP)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return `Error: ${msg}`;
}

function StrengthBar({ password }: { password: string }) {
  const len = password.length;
  const level = len === 0 ? 0 : len < 6 ? 1 : len < 10 ? 2 : len < 14 ? 3 : 4;
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Excelente'];
  const colors = ['bg-gray-200', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600'];
  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= level ? colors[level] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {len > 0 && (
        <p className={`text-xs font-medium ${level <= 1 ? 'text-red-500' : level === 2 ? 'text-amber-500' : 'text-emerald-600'}`}>
          {labels[level]}
        </p>
      )}
    </div>
  );
}

export default function AuthPage() {
  const { login, register, sendPasswordReset } = useAuth();

  const [mode, setMode]         = useState<Mode>('login');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

  function switchMode(m: Mode) { setMode(m); setError(''); setSuccess(''); }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'register') {
        await register(email, password, name);
        setSuccess('¡Cuenta creada! Revisa tu correo para confirmarla.');
        switchMode('login');
      } else {
        await sendPasswordReset(email);
        setSuccess('Te enviamos un enlace a tu correo. Revisa tu bandeja de entrada.');
      }
    } catch (err: unknown) {
      setError(mapError((err as { message?: string })?.message ?? ''));
    } finally {
      setLoading(false);
    }
  }

  const isLogin  = mode === 'login';
  const isForgot = mode === 'forgot';

  const inputCls = `
    w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white
    text-gray-900 text-base placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
    transition-all duration-200 hover:border-gray-300
  `;

  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-120 shrink-0 relative overflow-hidden"
           style={{ background: 'linear-gradient(160deg, #064e3b 0%, #065f46 50%, #047857 100%)' }}>

        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #6ee7b7, transparent)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10 translate-x-1/3 translate-y-1/3"
             style={{ background: 'radial-gradient(circle, #34d399, transparent)' }} />
        <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #a7f3d0, transparent)' }} />

        <div className="relative flex flex-col h-full p-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-emerald-200" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Alacena</span>
          </div>

          {/* Main copy */}
          <div className="mt-auto mb-auto pt-20">
            <p className="text-emerald-300 text-sm font-semibold uppercase tracking-widest mb-4">
              Inventario inteligente
            </p>
            <h1 className="text-white text-5xl font-bold leading-tight mb-8">
              Tu alacena,<br />siempre bajo<br />control.
            </h1>
            <ul className="space-y-5">
              {[
                'Inventario de alimentos en tiempo real',
                'Alertas antes de que venzan los productos',
                'Lista de compras generada automáticamente',
                'Accede desde cualquier dispositivo',
              ].map((feat) => (
                <li key={feat} className="flex items-center gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-emerald-300" />
                  </div>
                  <span className="text-emerald-100 text-base">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-emerald-600 text-sm">© 2025 Alacena</p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-105">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl">Alacena</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            {isForgot && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al inicio de sesión
              </button>
            )}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bienvenido de nuevo' : isForgot ? 'Recuperar contraseña' : 'Crea tu cuenta'}
            </h2>
            <p className="text-gray-500 text-base">
              {isLogin
                ? 'Ingresa tus datos para continuar.'
                : isForgot
                ? 'Te enviaremos un enlace para restablecer tu contraseña.'
                : 'Regístrate gratis, solo toma un minuto.'}
            </p>
          </div>

          {/* Mode tabs — hidden in forgot mode */}
          {!isForgot && (
            <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    mode === m
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {m === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              ))}
            </div>
          )}

          {/* Banners */}
          {success && (
            <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-4 mb-6 text-sm leading-relaxed">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej: María García"
                  autoComplete="name"
                  className={inputCls}
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
                autoComplete="email"
                className={inputCls}
              />
            </div>

            {/* Password — hidden in forgot mode */}
            {!isForgot && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-700">
                    Contraseña
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-xs text-emerald-600 font-semibold hover:underline underline-offset-2"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isForgot}
                    minLength={6}
                    placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className={inputCls + ' pr-14'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {!isLogin && <StrengthBar password={password} />}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5
                           bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                           disabled:bg-emerald-300 disabled:cursor-not-allowed
                           text-white text-base font-semibold
                           py-4 rounded-2xl
                           transition-all duration-200
                           shadow-md hover:shadow-lg hover:shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Cargando...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Entrar a Alacena' : isForgot ? 'Enviar enlace' : 'Crear cuenta gratis'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          {!isForgot && (
            <p className="text-center text-sm text-gray-400 mt-8">
              {isLogin ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
              <button
                onClick={() => switchMode(isLogin ? 'register' : 'login')}
                className="text-emerald-600 font-semibold hover:underline underline-offset-2"
              >
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
