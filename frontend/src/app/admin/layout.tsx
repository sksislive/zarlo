"use client";
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isHydrated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, isHydrated, router]);

  if (!isHydrated || !user || user.role !== 'admin') return null;

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Orders', icon: 'package_2', path: '/admin/orders' },
    { label: 'Category', icon: 'category', path: '/admin/categories' },
    { label: 'Inventory', icon: 'inventory_2', path: '/admin/inventory' },
    { label: 'Customers', icon: 'group', path: '/admin/customers' },
    { label: 'Analytics', icon: 'monitoring', path: '/admin/analytics' },
  ];

  return (
    <div className="min-h-screen bg-surface flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-lowest flex flex-col border-r border-white/5 font-label tracking-wider z-50">
        <div className="px-8 py-10">
          <Link href="/">
            <h1 className="text-lg font-bold text-secondary">ZARLO ADMIN</h1>
            <p className="text-[10px] tracking-[0.3em] text-primary/50 mt-1 uppercase">Management Console</p>
          </Link>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`${pathname === item.path ? 'bg-surface-container-high text-white border-l-4 border-tertiary' : 'text-primary'} px-6 py-4 flex items-center gap-4 hover:bg-surface-container hover:text-secondary transition-all duration-200 ease-in-out`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm uppercase">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="flex items-center gap-3 p-4 bg-surface-container-high">
            <div className="w-10 h-10 bg-secondary flex items-center justify-center text-on-secondary font-bold">A</div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-tighter">{user.name}</span>
              <span className="text-[10px] text-primary">System Overlord</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top Context Header */}
        <header className="h-24 px-12 flex justify-between items-center bg-surface-container-lowest sticky top-0 z-40 border-b border-white/5">
          <div className="flex flex-col">
            <h2 className="font-headline text-2xl font-black uppercase tracking-[0.1em] text-white">
              {menuItems.find(m => m.path === pathname)?.label || 'Admin Console'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary"></span>
              <span className="font-label text-[10px] uppercase text-primary tracking-widest">Live: Data Feed</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="font-label text-xs tracking-widest border-b border-outline-variant hover:border-secondary text-primary transition-all py-1 uppercase">Export</button>
            <div className="w-px h-8 bg-outline-variant/30"></div>
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary cursor-pointer hover:text-white">notifications</span>
              <span className="material-symbols-outlined text-primary cursor-pointer hover:text-white">search</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
