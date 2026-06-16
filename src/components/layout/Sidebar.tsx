import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ShoppingBasket, BarChart2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const links = [
  { to: '/',         icon: LayoutDashboard, label: 'Inicio'    },
  { to: '/despensa', icon: Package,         label: 'Despensa'  },
  { to: '/compras',  icon: ShoppingCart,    label: 'Compras'   },
  { to: '/consumo',  icon: BarChart2,       label: 'Consumo'   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col min-h-screen shrink-0 shadow-sm">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
          <ShoppingBasket className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg">Freshly App</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
            {(user?.user_metadata?.full_name?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.full_name ?? 'Usuario'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
