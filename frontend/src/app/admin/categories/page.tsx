"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CategoryPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      if (isEditing) {
        await axios.put(`/api/categories/${editId}`, { name, description }, config);
        toast.success('CATEGORY UPDATED');
      } else {
        await axios.post('/api/categories', { name, description }, config);
        toast.success('CATEGORY CREATED');
      }
      setName('');
      setDescription('');
      setIsEditing(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'ACTION FAILED');
    }
  };

  const handleEdit = (cat: any) => {
    setName(cat.name);
    setDescription(cat.description);
    setIsEditing(true);
    setEditId(cat._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('PROTOCOL: CONFIRM REMOVAL?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user?.token}` } };
        await axios.delete(`/api/categories/${id}`, config);
        toast.success('CATEGORY REMOVED');
        fetchCategories();
      } catch (error) {
        toast.error('REMOVAL FAILED');
      }
    }
  };

  return (
    <section className="p-12 space-y-12">
      <div className="bg-surface-container-low p-8 border border-white/5">
        <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-white mb-8">
          {isEditing ? 'MODIFY CATEGORY' : 'ESTABLISH NEW CATEGORY'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Category Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all"
                placeholder="E.G. OUTERWEAR"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Brief Directive</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all"
                placeholder="CATEGORY DESCRIPTION"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-secondary px-8 py-4 text-on-secondary font-label text-xs font-bold tracking-[0.2em] hover:bg-white transition-colors uppercase">
              {isEditing ? 'COMMIT UPDATE' : 'CREATE PROTOCOL'}
            </button>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => { setIsEditing(false); setName(''); setDescription(''); }}
                className="border border-outline-variant px-8 py-4 text-primary font-label text-xs font-bold tracking-[0.2em] hover:border-white transition-colors uppercase"
              >
                CANCEL
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-surface-container-low overflow-hidden">
        <div className="p-8 border-b border-outline-variant/10">
          <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-white">CATEGORY INDEX</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-label">
            <thead>
              <tr className="text-[10px] text-primary/50 tracking-[0.3em] uppercase border-b border-outline-variant/10">
                <th className="px-8 py-6 font-normal">Ident-Code</th>
                <th className="px-8 py-6 font-normal">Classification</th>
                <th className="px-8 py-6 font-normal">Description</th>
                <th className="px-8 py-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {loading ? (
                <tr><td colSpan={4} className="p-12 text-center text-primary uppercase animate-pulse">Syncing categories...</td></tr>
              ) : (
                categories.map((cat: any) => (
                  <tr key={cat._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-xs text-primary font-mono">{cat._id.substring(18).toUpperCase()}</td>
                    <td className="px-8 py-6 text-white font-bold text-sm tracking-widest uppercase">{cat.name}</td>
                    <td className="px-8 py-6 text-xs text-primary">{cat.description || 'Global Protocol'}</td>
                    <td className="px-8 py-6 text-right space-x-4">
                      <button onClick={() => handleEdit(cat)} className="material-symbols-outlined text-primary hover:text-secondary text-sm">edit</button>
                      <button onClick={() => handleDelete(cat._id)} className="material-symbols-outlined text-primary hover:text-tertiary text-sm">delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
