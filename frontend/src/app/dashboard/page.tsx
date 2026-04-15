"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

export default function UserDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      fetchOrders();
    }
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('/api/orders/myorders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-7xl mx-auto px-6 md:px-12 pt-12">
        {/* User Profile & Order History */}
        <div className="lg:col-span-3 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 border-b border-outline-variant/10 pb-8">
            <div className="w-32 h-32 bg-surface-container-high relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA9nE6li_hxfNe4Gc4CyqdqibfS5a6cf1NTQBKpbqd_o8Rr6YgDE49XWUR0cIXjPXeP1qjO-mMmiDm_XKh1eCR5kpFi9lJwpc0kEHpx11x7zR6pcmkjj19UahpwvWG_y9fa5FIa36lINY7CnjVOhIofo2xHovgMLL5_eqa186823_g_YnkzNXKRpnmh2zSfg0dPleaP4fuNARx6mnAuUcUSuiLyE5H0HwXlrL5uaVJ7F1heloX88VVfrI1Lgvtpkb9She_XsH7WL40" 
                alt="User Avatar" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="flex-1 pb-2 flex justify-between items-end w-full">
              <div>
                <h4 className="font-headline text-4xl font-black uppercase tracking-tight text-white leading-none">
                  {user.name}
                </h4>
                <p className="font-label text-xs text-secondary mt-2 tracking-[0.3em] uppercase">
                  {user.role === 'admin' ? 'System Admin' : user.role === 'seller' ? 'Authorized Seller' : 'CORE MEMBER'} • ACCESS GRANTED
                </p>
                <p className="font-label text-[10px] text-primary mt-1 tracking-widest">{user.email}</p>
              </div>
              <button onClick={handleLogout} className="font-label text-[10px] tracking-widest text-error hover:underline uppercase">LOGOUT</button>
            </div>
          </div>

          {/* Quick Links for Admin/Seller */}
          {(user.role === 'admin' || user.role === 'seller') && (
            <div className="flex gap-4">
              {user.role === 'admin' && (
                <Link href="/admin" className="bg-secondary text-on-secondary px-6 py-3 font-label text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors">
                  ADMIN CONSOLE
                </Link>
              )}
              {user.role === 'seller' && (
                <Link href="/seller" className="bg-white text-black px-6 py-3 font-label text-xs font-bold tracking-widest uppercase hover:bg-secondary hover:text-black transition-colors">
                  SELLER CONSOLE
                </Link>
              )}
            </div>
          )}

          {/* Order History */}
          <div className="space-y-6">
            <h5 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Order Archive</h5>
            {loading ? (
              <p className="font-label text-xs tracking-widest text-primary uppercase">Syncing Records...</p>
            ) : orders.length === 0 ? (
              <p className="font-label text-xs tracking-widest text-primary uppercase">No past acquisitions.</p>
            ) : (
              <div className="space-y-2">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-surface-container-low p-6 flex justify-between items-center group cursor-pointer hover:bg-surface-container-high transition-colors">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-6 md:items-center">
                      <span className="font-label text-xs text-secondary w-32 truncate">#{order._id.substring(18)}</span>
                      <span className="font-label text-[10px] tracking-widest text-primary uppercase">
                        {order.isDelivered ? `DELIVERED: ${new Date(order.deliveredAt).toLocaleDateString()}` : order.isPaid ? 'PAID / PROCESSING' : 'AWAITING PAYMENT'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-label text-xs font-bold text-white">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                      <span className="material-symbols-outlined text-primary group-hover:text-secondary">chevron_right</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Preview / Account Security */}
        <div className="lg:col-span-2 space-y-12">
          {/* Wishlist */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h5 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Wishlist</h5>
              <Link className="font-label text-[10px] text-primary tracking-widest border-b border-transparent hover:border-primary transition-all uppercase" href="/products">VIEW ALL</Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {/* Placeholders representing wishlist items from design */}
               <div className="bg-surface-container-low aspect-[3/4] relative group cursor-pointer">
                 <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1aCflgCFtcbciPUMNiruu0AcyFemV_ZRkhWGLwRRiTgo-Dn6Er16naJOQn3oLi491XiECdHF02TAMFyV3mXH1MLvZLMEDAq6OoO9AHeREiYnVFwtKlWzBYw-UmImFDPCLvvpBi40z3mht7oFNU5j8EQ5tCUgxM59Ct6dOmMQnJXPkcVhh30dX6q4rkNNEBLh4U5BISo1zPZG01V5iV-WdSLc8Fm2ecusLupGYEq3qexPVBV5dxp4tjtytCti_hHbWByNtKBDtGRKd" alt="Wishlist 1" fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"/>
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                   <p className="font-label text-[10px] text-white tracking-widest truncate uppercase">CRIMSON OVERCOAT</p>
                   <p className="font-label text-xs text-secondary font-bold">₹120,400</p>
                 </div>
               </div>
               <div className="bg-surface-container-low aspect-[3/4] relative group cursor-pointer">
                 <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaKklyo949wH7iGbG_ishHRpMl1q7thHd3HE5Cm32u1WZVFuJn9YPb0F5xKBTjGEWzWwxk1AgwwoD70xbUXWYd96tie_NspHa625yBYCOtptmwPHF6npnnO87GmsZkE8-A0GgeBvd_LrDOCLQkLt1m1AHMnlwDmMzTdrLiSqlpUwe2NdIch7LAMWdCozdQezn8_PgbKcn_zPCLCisibF4V4VFo_1hW0WywAsv5BHk6mczeYaQxmxaiGyAbrkujZ6CuDW-nfRBY4v7N" alt="Wishlist 2" fill className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500"/>
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                   <p className="font-label text-[10px] text-white tracking-widest truncate uppercase">OBSIDIAN TIMEPIECE</p>
                   <p className="font-label text-xs text-secondary font-bold">₹210,000</p>
                 </div>
               </div>
            </div>
          </div>
          
          <div className="border border-white/5 p-6 space-y-4">
             <h5 className="font-headline text-sm font-bold uppercase tracking-widest text-white">ACCESS SETTINGS</h5>
             <Link href="#" className="block font-label text-xs text-primary hover:text-white uppercase tracking-widest">Update Credentials</Link>
             <Link href="#" className="block font-label text-xs text-primary hover:text-white uppercase tracking-widest">Payment Methods</Link>
             <Link href="#" className="block font-label text-xs text-primary hover:text-white uppercase tracking-widest">Shipping Addresses</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
