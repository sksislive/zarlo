"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function InventoryPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('/api/products/admin', config);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleApprove = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      await axios.put(`/api/products/${id}`, { status: newStatus }, config);
      toast.success(`SYSTEM UPDATED: ${newStatus.toUpperCase()}`, {
        style: { borderRadius: '0px', background: '#131313', color: '#eac169' }
      });
      fetchProducts();
    } catch (error) {
      toast.error('G/L UPDATE FAILED');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('PROTOCOL: CONFIRM PERMANENT REMOVAL?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        toast.success('ARCHIVE REMOVED');
        fetchProducts();
      } catch (error) {
        toast.error('REMOVAL ABORTED');
      }
    }
  };

  return (
    <section className="p-12">
      <div className="bg-surface-container-low">
        <div className="p-8 flex justify-between items-center border-b border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-white">Product Inventory</h3>
          <Link href="/admin/inventory/add">
            <button className="bg-secondary px-8 py-4 text-on-secondary font-label text-xs font-bold tracking-[0.2em] hover:bg-white transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              ADD NEW PRODUCT
            </button>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-label tracking-widest text-primary uppercase animate-pulse">Establishing Connection to Vault...</div>
          ) : (
            <table className="w-full text-left font-label">
              <thead>
                <tr className="text-[10px] text-primary/50 tracking-[0.3em] uppercase border-b border-outline-variant/10">
                  <th className="px-8 py-6 font-normal">Product</th>
                  <th className="px-8 py-6 font-normal">SKU REFERENCE</th>
                  <th className="px-8 py-6 font-normal text-center">Status</th>
                  <th className="px-8 py-6 font-normal text-right">Price</th>
                  <th className="px-8 py-6 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {products.map((p: any) => (
                  <tr key={p._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="w-12 h-16 bg-surface-container-high overflow-hidden relative">
                        {p.images && p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-primary/20">NO IMG</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm tracking-widest uppercase">{p.name}</p>
                        <p className="text-[10px] text-primary uppercase">CAT: {p.category}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-xs text-primary font-mono">{p._id.substring(18).toUpperCase()}</td>
                    <td className="px-8 py-6 text-center">
                      {p.status === 'approved' ? (
                        <span className="px-3 py-1 bg-secondary-container/20 text-secondary text-[10px] font-bold tracking-widest">APPROVED</span>
                      ) : (
                        <span className="px-3 py-1 bg-tertiary-container/20 text-tertiary text-[10px] font-bold tracking-widest">PENDING</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right font-bold text-white text-sm">₹{(p.discountPrice || p.price || 0).toLocaleString()}</td>
                    <td className="px-8 py-6 text-right space-x-4">
                      <button 
                        onClick={() => handleApprove(p._id, p.status)}
                        title="Toggle Status"
                        className="material-symbols-outlined text-primary hover:text-white transition-all transform hover:rotate-180 text-sm"
                      >sync</button>
                      <Link href={`/admin/inventory/edit/${p._id}`}>
                        <button title="Edit Archive" className="material-symbols-outlined text-primary hover:text-secondary text-sm">edit</button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        title="Delete Product"
                        className="material-symbols-outlined text-primary hover:text-tertiary text-sm"
                      >delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}
