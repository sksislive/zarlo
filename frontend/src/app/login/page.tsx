"use client";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import { AppDispatch, RootState } from '../../redux/store';
import Image from 'next/image';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error, isHydrated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isHydrated && user) {
      router.push('/dashboard');
    }
  }, [user, isHydrated, router]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      dispatch(loginSuccess(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface-container-low overflow-hidden">
        {/* Left Side: Editorial Content */}
        <div className="hidden lg:flex lg:col-span-7 relative h-full min-h-[700px] flex-col justify-end p-12 overflow-hidden">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm5tP0aNom-b3zKaHhRGzU8I19dRAofKqrlwX6TY7GEb9xOXNUb24jXGvdpVdTPogPhGCBkaSfthgSsA8DYutulK7VXeK8wi_ppFY21230mYtMdh8N8pIPQQ9-65kT29I29YexlzvIqzgyWA0Vm1RUN8uCp2R9uQOG18fErw0TkjhHDT4Foqwj-ITBlTJ6D8fc8Jefy9_YVX8_1hjzrQTispfU10jfzgRSKbUddlQy0VOM_X40eeEolWME4ASrU1hCMMZaLx9g_31y"
            alt="Cinematic fashion editorial"
            fill
            className="object-cover grayscale brightness-50 z-0"
          />
          <div className="relative z-10">
            <p className="font-label text-secondary text-sm tracking-[0.3em] mb-4 uppercase">Identity & Access</p>
            <h2 className="font-headline text-6xl font-black text-white leading-tight uppercase tracking-tighter">
              DIGITAL <br /> FLAGSHIP <br /> ACCESS
            </h2>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-16 lg:p-20 bg-surface z-10">
          <div className="mb-12">
            <h1 className="font-headline text-5xl font-black text-on-surface tracking-tight uppercase leading-none mb-2">WELCOME BACK</h1>
            <div className="w-12 h-1 bg-secondary"></div>
          </div>

          {error && <div className="mb-6 p-4 bg-error-container text-on-error-container font-label text-xs uppercase tracking-widest">{error}</div>}

          <form onSubmit={submitHandler} className="space-y-8">
            <div className="space-y-2 group">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-white font-label placeholder:text-outline/30 transition-all outline-none"
                placeholder="NAME@DOMAIN.COM"
                required
              />
            </div>

            <div className="space-y-2 group">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-3 text-white font-label placeholder:text-outline/30 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link href="#" className="font-label text-[10px] tracking-widest text-outline hover:text-secondary transition-all uppercase">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-on-secondary font-headline font-bold py-6 px-12 text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-outline-variant/30 flex flex-col gap-4">
            <p className="font-label text-[11px] tracking-widest text-primary uppercase">
              Don't have an account?
              <Link href="/register" className="text-secondary hover:text-white transition-colors ml-2">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
