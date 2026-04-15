"use client";
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 md:px-12 h-24 no-line-boundary tonal-shift">
      <div className="flex-shrink-0">
        <Link href="/" className="text-2xl font-black tracking-[0.2em] text-white font-headline">
          ZARLO
        </Link>
      </div>

      <div className="hidden md:flex gap-10">
        <Link href="/products?category=mens" className={`font-headline uppercase tracking-[0.1em] text-sm transition-colors ${pathname.includes('mens') ? "text-secondary after:content-[''] after:block after:w-1 after:h-1 after:bg-tertiary after:mx-auto" : "text-primary hover:text-white"}`}>
          MEN
        </Link>
        <Link href="/products?category=womens" className={`font-headline uppercase tracking-[0.1em] text-sm transition-colors ${pathname.includes('womens') ? "text-secondary after:content-[''] after:block after:w-1 after:h-1 after:bg-tertiary after:mx-auto" : "text-primary hover:text-white"}`}>
          WOMEN
        </Link>
        <Link href="/products?category=new" className={`font-headline uppercase tracking-[0.1em] text-sm transition-colors ${pathname.includes('new') ? "text-secondary after:content-[''] after:block after:w-1 after:h-1 after:bg-tertiary after:mx-auto" : "text-primary hover:text-white"}`}>
          NEW ARRIVALS
        </Link>
        <Link href="/products" className={`font-headline uppercase tracking-[0.1em] text-sm transition-colors ${pathname === '/products' ? "text-secondary after:content-[''] after:block after:w-1 after:h-1 after:bg-tertiary after:mx-auto" : "text-primary hover:text-white"}`}>
          COLLECTIONS
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-primary hover:bg-white/5 p-2 transition-all duration-300">
          <span className="material-symbols-outlined" data-icon="search">search</span>
        </button>
        <Link href="/cart" className="text-primary hover:bg-white/5 p-2 transition-all duration-300 relative group">
          <span className="material-symbols-outlined group-hover:text-white" data-icon="shopping_cart">shopping_cart</span>
          {cartItems.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full"></span>}
        </Link>
        <Link href={user ? "/dashboard" : "/login"} className="text-primary hover:bg-white/5 p-2 transition-all duration-300">
          <span className="material-symbols-outlined hover:text-white" data-icon="person">person</span>
        </Link>
      </div>
    </nav>
  );
}
