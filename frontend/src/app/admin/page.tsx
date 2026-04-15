"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function AdminDashboard() {
  return (
    <section className="p-12 space-y-12">
      {/* Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-8 border-l-2 border-secondary flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs tracking-[0.2em] text-primary uppercase">Total Revenue</span>
            <span className="material-symbols-outlined text-secondary">payments</span>
          </div>
          <div>
            <p className="font-headline text-4xl font-black text-white">₹1,42,850</p>
            <p className="font-label text-[10px] text-tertiary mt-2 uppercase">+12.4% FROM LAST QUARTER</p>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-8 border-l-2 border-primary flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs tracking-[0.2em] text-primary uppercase">Pending Orders</span>
            <span className="material-symbols-outlined text-primary">shopping_bag</span>
          </div>
          <div>
            <p className="font-headline text-4xl font-black text-white">422</p>
            <p className="font-label text-[10px] text-primary mt-2 uppercase">12 ORDERS REQUIRES ATTENTION</p>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 border-l-2 border-tertiary flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs tracking-[0.2em] text-primary uppercase">Active Customers</span>
            <span className="material-symbols-outlined text-tertiary">person_add</span>
          </div>
          <div>
            <p className="font-headline text-4xl font-black text-white">8.9K</p>
            <p className="font-label text-[10px] text-tertiary mt-2 uppercase">86 NEW USERS TODAY</p>
          </div>
        </div>
      </div>

      {/* User Perspective Preview (Embedded in Dashboard) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 pt-12 border-t border-outline-variant/10">
        {/* User Profile & Order History */}
        <div className="lg:col-span-3 space-y-12">
          <div className="flex items-end gap-8">
            <div className="w-32 h-32 bg-surface-container-high relative">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA9nE6li_hxfNe4Gc4CyqdqibfS5a6cf1NTQBKpbqd_o8Rr6YgDE49XWUR0cIXjPXeP1qjO-mMmiDm_XKh1eCR5kpFi9lJwpc0kEHpx11x7zR6pcmkjj19UahpwvWG_y9fa5FIa36lINY7CnjVOhIofo2xHovgMLL5_eqa186823_g_YnkzNXKRpnmh2zSfg0dPleaP4fuNARx6mnAuUcUSuiLyE5H0HwXlrL5uaVJ7F1heloX88VVfrI1Lgvtpkb9She_XsH7WL40" 
                alt="User Avatar" 
                fill 
                className="object-cover grayscale" 
              />
            </div>
            <div className="flex-1 pb-2">
              <h4 className="font-headline text-4xl font-black uppercase tracking-tight text-white leading-none">MARCUS VANE</h4>
              <p className="font-label text-xs text-secondary mt-2 tracking-[0.3em]">MEMBER SINCE 2022 • PLATINUM TIER</p>
            </div>
          </div>
          <div className="space-y-6">
            <h5 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Order History</h5>
            <div className="space-y-1">
              <div className="bg-surface-container-low p-6 flex justify-between items-center group cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex gap-6">
                  <span className="font-label text-xs text-primary w-24">#ZR-88492</span>
                  <span className="font-label text-xs text-white">DELIVERED: OCT 12, 2023</span>
                </div>
                <span className="font-label text-xs font-bold text-white">₹12,400.00</span>
                <span className="material-symbols-outlined text-primary group-hover:text-secondary">chevron_right</span>
              </div>
              <div className="bg-surface-container-low p-6 flex justify-between items-center group cursor-pointer hover:bg-surface-container-high transition-colors">
                <div className="flex gap-6">
                  <span className="font-label text-xs text-primary w-24">#ZR-87301</span>
                  <span className="font-label text-xs text-white">DELIVERED: AUG 05, 2023</span>
                </div>
                <span className="font-label text-xs font-bold text-white">₹4,500.00</span>
                <span className="material-symbols-outlined text-primary group-hover:text-secondary">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wishlist Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h5 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Wishlist Feed</h5>
            <span className="font-label text-[10px] text-primary tracking-widest border-b border-transparent hover:border-primary transition-all cursor-pointer">VIEW ALL</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low aspect-[3/4] relative group cursor-pointer overflow-hidden">
              <Image fill src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1aCflgCFtcbciPUMNiruu0AcyFemV_ZRkhWGLwRRiTgo-Dn6Er16naJOQn3oLi491XiECdHF02TAMFyV3mXH1MLvZLMEDAq6OoO9AHeREiYnVFwtKlWzBYw-UmImFDPCLvvpBi40z3mht7oFNU5j8EQ5tCUgxM59Ct6dOmMQnJXPkcVhh30dX6q4rkNNEBLh4U5BISo1zPZG01V5iV-WdSLc8Fm2ecusLupGYEq3qexPVBV5dxp4tjtytCti_hHbWByNtKBDtGRKd" alt="Wishlist 1" className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="font-label text-[10px] text-white tracking-widest uppercase">Crimson Overcoat</p>
                <p className="font-label text-xs text-secondary font-bold">₹14,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
