"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SellerDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, router]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.post('/api/products', {
        name, price: Number(price), description, category, brand, stock: Number(stock), images: [imageUrl]
      }, config);
      toast.success('ASSET SUBMITTED FOR CLEARANCE.', {
        style: { borderRadius: '0px', background: '#131313', color: '#eac169' }
      });
      // Reset form
      setName(''); setPrice(''); setDescription(''); setCategory(''); setBrand(''); setStock(''); setImageUrl('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'TRANSMISSION ERROR');
    }
    setLoading(false);
  };

  if (!user || (user.role !== 'seller' && user.role !== 'admin')) return null;

  return (
    <div className="min-h-screen pt-24 max-w-5xl mx-auto px-6 lg:px-12 pb-20">
      <header className="h-24 flex justify-between items-center bg-background/90 backdrop-blur-md mb-8">
        <div className="flex flex-col">
          <h2 className="font-headline text-2xl font-black uppercase tracking-[0.1em] text-white">Distributor Console</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-secondary"></span>
            <span className="font-label text-[10px] uppercase text-secondary tracking-widest">Authorized Access</span>
          </div>
        </div>
      </header>
      
      <div className="bg-surface border-l-4 border-secondary p-8 md:p-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="material-symbols-outlined text-9xl">inventory_2</span>
        </div>
        
        <h2 className="font-headline text-3xl font-black uppercase tracking-tight text-white mb-2 relative z-10">Submit New Asset</h2>
        <p className="font-label text-xs tracking-widest text-primary uppercase mb-12 relative z-10">Fill all parameters for admin clearance.</p>
        
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Asset Designation (Name)</label>
            <input required value={name} onChange={(e)=>setName(e.target.value)} type="text" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" />
          </div>
          
          <div className="space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Valuation (₹)</label>
            <input required value={price} onChange={(e)=>setPrice(e.target.value)} type="number" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none appearance-none" />
          </div>
          
          <div className="space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Initial Stock</label>
            <input required value={stock} onChange={(e)=>setStock(e.target.value)} type="number" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none appearance-none" />
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Technical Specifications (Description)</label>
            <textarea required value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none resize-none" />
          </div>
          
          <div className="space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Category Directive</label>
            <input required value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="e.g. OUTERWEAR" type="text" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none uppercase placeholder:text-outline-variant" />
          </div>
          
          <div className="space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Manufacturer Segment (Brand)</label>
            <input value={brand} onChange={(e)=>setBrand(e.target.value)} type="text" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none uppercase" />
          </div>
          
          <div className="col-span-1 md:col-span-2 space-y-2 group">
            <label className="block font-label text-[10px] text-primary tracking-widest uppercase">Asset Image URL</label>
            <input required value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} type="url" className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" />
          </div>
          
          <div className="col-span-1 md:col-span-2 mt-8">
            <button disabled={loading} type="submit" className="w-full bg-secondary text-on-secondary font-headline font-bold py-6 px-12 text-sm tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50">
              {loading ? 'TRANSMITTING...' : 'SUBMIT PROTOCOL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
