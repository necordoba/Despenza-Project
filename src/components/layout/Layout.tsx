import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/':         'Inicio',
  '/despensa': 'Despensa',
  '/compras':  'Lista de compras',
  '/consumo':  'Consumo',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Alacena';

  return (
    <div className="flex min-h-screen" style={{ background: '#f1f5f9' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-10 flex items-center px-6 h-14 shrink-0"
          style={{
            background: 'rgba(241,245,249,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
