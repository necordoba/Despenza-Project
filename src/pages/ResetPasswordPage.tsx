import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Leaf, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const inputCls = `
    w-full px-4 py-4 rounded-2xl border border-gray-200 bg-white
    text-gray-900 text-base placeholder:text-gray-400
    focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
    transition-all duration-200 hover:border-gray-300
  `;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6)  { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/auth'), 2500);
    } catch {
      setError('No se pudo actualizar la contraseña. Intenta solicitar un nuevo enlace.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="w-full max-w-md">

        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-gray-900 font-bold text-xl">Alacena</span>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Nueva contraseña</h2>
          <p className="text-gray-500 text-base">Elige una contraseña segura para tu cuenta.</p>
        </div>

        {success ? (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-4 text-sm leading-relaxed">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ¡Contraseña actualizada! Redirigiendo al inicio de sesión...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className={inputCls + ' pr-14'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirmar contraseña</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repite la contraseña"
                className={inputCls}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5
                           bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                           disabled:bg-emerald-300 disabled:cursor-not-allowed
                           text-white text-base font-semibold
                           py-4 rounded-2xl transition-all duration-200
                           shadow-md hover:shadow-lg hover:shadow-emerald-500/20"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : 'Guardar nueva contraseña'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
