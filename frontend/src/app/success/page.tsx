"use client";
import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/dashboard');
    }, 10000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background pt-24 text-center z-10 relative">
      <div className="w-24 h-24 bg-surface-container flex items-center justify-center rounded-full mb-8 border border-white/5 shadow-[0_0_50px_rgba(234,193,105,0.1)]">
        <span className="material-symbols-outlined text-[48px] text-secondary" data-icon="check_circle">check_circle</span>
      </div>
      
      <h1 className="font-headline text-4xl md:text-5xl font-black mb-4 uppercase tracking-tighter text-white">
        Transaction Secured
      </h1>
      
      <p className="font-label text-sm text-primary max-w-lg tracking-widest leading-relaxed mb-12 uppercase">
        Authorization complete. Your acquisition is currently being processed by the fulfillment matrix.
        {paymentId && <span className="block mt-4 text-[10px] text-outline-variant font-body">REF: {paymentId}</span>}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/dashboard" className="flex-1 bg-secondary text-on-secondary font-headline font-bold py-4 px-6 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300">
          Access Archives
        </Link>
        <Link href="/products" className="flex-1 bg-transparent border border-outline-variant text-white font-headline font-bold py-4 px-6 text-xs tracking-[0.2em] uppercase hover:border-secondary transition-all duration-300">
          Continue
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-primary font-label text-xs tracking-widest uppercase">
        Authorizing...
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
