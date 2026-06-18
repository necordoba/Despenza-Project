import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, BarChart2, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/',         icon: LayoutDashboard, label: 'Inicio'   },
  { to: '/despensa', icon: Package,         label: 'Despensa' },
  { to: '/compras',  icon: ShoppingCart,    label: 'Compras'  },
  { to: '/consumo',  icon: BarChart2,       label: 'Consumo'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const initial = (user?.user_metadata?.full_name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase();

  return (
    <aside
      className="w-64 flex flex-col min-h-screen shrink-0"
      style={{ background: 'linear-gradient(170deg, #0c2416 0%, #14532d 100%)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 pt-7 pb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(110,231,183,0.18)' }}
        >
          <UtensilsCrossed className="w-4.5 h-4.5 text-emerald-300" />
        </div>
        <span className="font-extrabold text-white text-lg tracking-tight">Alacena</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/[0.14] text-white'
                  : 'text-emerald-300/80 hover:bg-white/[0.07] hover:text-white'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div
        className="px-3 py-4 mt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white select-none"
            style={{ background: 'rgba(110,231,183,0.25)' }}
          >
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {user?.user_metadata?.full_name ?? 'Usuario'}
            </p>
            <p className="text-xs text-emerald-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-emerald-300/80 hover:bg-white/8 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
