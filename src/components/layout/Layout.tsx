import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart2 } from 'lucide-react';
import Sidebar from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/':         'Inicio',
  '/despensa': 'Despensa',
  '/compras':  'Lista de compras',
  '/consumo':  'Consumo',
};

const mobileLinks = [
  { to: '/',         icon: LayoutDashboard, label: 'Inicio',    end: true  },
  { to: '/despensa', icon: Package,         label: 'Despensa',  end: false },
  { to: '/compras',  icon: ShoppingCart,    label: 'Compras',   end: false },
  { to: '/consumo',  icon: BarChart2,       label: 'Consumo',   end: false },
];

export default function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Alacena';

  return (
    <div className="flex min-h-screen" style={{ background: '#f1f5f9' }}>
      {/* Sidebar — desktop only */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex items-center px-6 h-14 shrink-0"
          style={{
            background: 'rgba(241,245,249,0.88)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
        </header>

        {/* Page content — extra bottom padding on mobile for the nav bar */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-white"
        style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.07), 0 -4px 16px rgba(0,0,0,0.06)' }}
      >
        {mobileLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-semibold transition-colors ${
                isActive ? 'text-emerald-600' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? 'bg-emerald-50' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
