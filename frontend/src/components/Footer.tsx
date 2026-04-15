"use client";
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) return null;
  return (
    <footer className="bg-[#0E0E0E] w-full py-20 px-6 md:px-12 tonal-shift-from-surface mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-7xl mx-auto">
        <div className="md:col-span-1">
          <div className="text-4xl font-black tracking-widest text-white mb-8 font-headline">ZARLO</div>
          <p className="font-label text-xs tracking-tighter text-primary max-w-[200px] leading-relaxed">
            THE DIGITAL FLAGSHIP OF MODERN ARCHITECTURAL LUXURY STREETWEAR.
          </p>
        </div>
        <div>
          <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-6 uppercase">Collections</h4>
          <ul className="space-y-4 font-label text-xs tracking-tighter">
            <li><a className="text-primary hover:text-secondary transition-colors" href="/products?category=new">NEW ARRIVALS</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="/products?category=mens">MEN'S WEAR</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="/products?category=womens">WOMEN'S WEAR</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="/products">ACCESSORIES</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-6 uppercase">Support</h4>
          <ul className="space-y-4 font-label text-xs tracking-tighter">
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">SHIPPING & RETURNS</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">SIZE GUIDE</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">ORDER TRACKING</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">CONTACT</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-headline text-white font-bold text-sm tracking-widest mb-6 uppercase">Legal</h4>
          <ul className="space-y-4 font-label text-xs tracking-tighter">
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">PRIVACY POLICY</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">TERMS OF SERVICE</a></li>
            <li><a className="text-primary hover:text-secondary transition-colors" href="#">COOKIES SETTINGS</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <span className="font-label text-xs tracking-tighter text-primary">© 2024 ZARLO DIGITAL FLAGSHIP</span>
        <div className="flex gap-8">
          <a className="text-primary hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl" data-icon="brand_awareness">brand_awareness</span></a>
          <a className="text-primary hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl" data-icon="camera">camera</span></a>
          <a className="text-primary hover:text-white transition-colors" href="#"><span className="material-symbols-outlined text-xl" data-icon="videocam">videocam</span></a>
        </div>
      </div>
    </footer>
  );
}
