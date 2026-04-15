"use client";
import { useEffect, useState, use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [shippingCharges, setShippingCharges] = useState('0');
  const [taxes, setTaxes] = useState('0');

  // Advanced Size & Price State
  const [sizes, setSizes] = useState<{ size: string, stock: any, mrp: any, price: any }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: catData } = await axios.get('/api/categories');
        setCategories(catData);

        const { data: prodData } = await axios.get(`/api/products/${id}`);
        setName(prodData.name);
        setDescription(prodData.description);
        setCategory(prodData.category);
        setImages(prodData.images || []);
        setShippingCharges(prodData.shippingCharges?.toString() || '0');
        setTaxes(prodData.taxes?.toString() || '0');

        // Upgrade legacy data to includes MRP/Price if missing
        const mappedSizes = prodData.sizes && prodData.sizes.length > 0
          ? prodData.sizes.map((s: any) => ({
            size: s.size,
            stock: s.stock,
            mrp: s.mrp || prodData.sellingPrice || 0,
            price: s.price || prodData.discountPrice || 0
          }))
          : [{
            size: 'FREE SIZE',
            stock: prodData.stock || 0,
            mrp: prodData.sellingPrice || 0,
            price: prodData.discountPrice || 0
          }];

        setSizes(mappedSizes);
      } catch (error) { toast.error('FAILED TO FETCH ARCHIVE'); }
      setFetching(false);
    };
    fetchData();
  }, [id]);

  const addSizeField = () => setSizes([...sizes, { size: '', stock: '', mrp: '', price: '' }]);

  const selectAllSizes = () => {
    const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({
      size: s, stock: '', mrp: '', price: ''
    }));
    setSizes(standardSizes);
  };

  const removeSizeField = (index: number) => setSizes(sizes.filter((_, i) => i !== index));
  const handleSizeChange = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    (newSizes[index] as any)[field] = value;
    setSizes(newSizes);
  };

  const applyBulkValuation = (field: string, value: string) => {
    const updated = sizes.map(s => ({ ...s, [field]: value }));
    setSizes(updated);
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...images];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
    if (previewIdx === index) setPreviewIdx(targetIndex);
    else if (previewIdx === targetIndex) setPreviewIdx(index);
  };

  const setAsPrimary = (index: number) => {
    const newImages = [...images];
    const item = newImages.splice(index, 1)[0];
    newImages.unshift(item);
    setImages(newImages);
    setPreviewIdx(0);
    toast.success('PRIMARY ASSET ASSIGNED');
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      if (previewIdx >= filtered.length) setPreviewIdx(Math.max(0, filtered.length - 1));
      return filtered;
    });
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages(prev => [...prev, ...data]);
      toast.success('VISUAL ARCHIVE UPDATED');
    } catch (error) { toast.error('UPLOAD FAILED'); }
    setUploading(false);
  };

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const validSizes = sizes.filter(s => s.size && s.stock !== '');
    if (validSizes.length === 0) { toast.error('MINIMUM 1 SIZE REQUIRED'); return; }

    setLoading(true);
    try {
      const mainMrp = validSizes[0].mrp || 0;
      const mainPrice = validSizes[0].price || 0;

      await axios.put(`/api/products/${id}`, {
        name, description, category, images,
        sellingPrice: Number(mainMrp),
        discountPrice: Number(mainPrice),
        sizes: validSizes.map(s => ({
          size: s.size,
          stock: Number(s.stock),
          mrp: Number(s.mrp),
          price: Number(s.price)
        })),
        shippingCharges: Number(shippingCharges),
        taxes: Number(taxes)
      }, { headers: { Authorization: `Bearer ${user?.token}` } });
      toast.success('ARCHIVE UPDATED');
      router.push('/admin/inventory');
    } catch (error: any) { toast.error('UPDATE FAILED'); }
    setLoading(false);
  };

  if (fetching) return <div className="p-20 text-center text-secondary animate-pulse uppercase tracking-widest font-label text-xs">Synchronizing with Vault...</div>;

  return (
    <section className="p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1600px] mx-auto">
        <div className="lg:col-span-8 bg-surface-container-low p-10 border border-white/5 h-fit">
          <h3 className="font-headline text-2xl font-black uppercase tracking-widest text-white mb-10">Modify Archive Protocol</h3>
          <form onSubmit={submitHandler} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-primary uppercase">Identification</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all uppercase" required />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-primary uppercase">Category Protocol</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary appearance-none uppercase" required>
                  {categories.map((cat: any) => (<option key={cat._id} value={cat.name}>{cat.name}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-secondary uppercase font-bold text-[10px]">Shipping Charges (₹)</label>
                <input type="number" value={shippingCharges} onChange={(e) => setShippingCharges(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all text-sm" placeholder="₹ 0.00" required />
              </div>
              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-secondary uppercase font-bold text-[10px]">Taxes (%)</label>
                <input type="number" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all text-sm" placeholder="0" required />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-4 gap-4">
                <div className="space-y-1">
                  <label className="font-label text-xs tracking-widest text-secondary uppercase font-bold">Inventory & Valuation</label>
                  <p className="text-[9px] text-primary/40 uppercase tracking-tighter italic">Modify per size, or use bulk sync below</p>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={selectAllSizes} className="bg-white/5 hover:bg-white/10 text-primary px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 border border-white/5">
                    <span className="material-symbols-outlined text-sm">select_all</span> SELECT ALL SIZES
                  </button>
                  <button type="button" onClick={addSizeField} className="bg-secondary/10 hover:bg-secondary text-secondary hover:text-on-secondary px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_box</span> ADD VARIANT
                  </button>
                </div>
              </div>

              {/* Bulk Valuation Row */}
              {sizes.length > 1 && (
                <div className="bg-secondary/5 border border-secondary/20 p-6 flex flex-col md:flex-row items-center gap-8">
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="material-symbols-outlined text-secondary">bolt</span>
                    <span className="text-[10px] font-black text-white tracking-widest uppercase italic">Bulk Mode:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 flex-1 w-full">
                    <input type="number" onChange={(e) => applyBulkValuation('stock', e.target.value)} placeholder="SYNC STOCK" className="bg-transparent border-b border-white/10 px-2 py-2 text-[10px] font-bold text-white outline-none focus:border-secondary transition-all" />
                    <input type="number" onChange={(e) => applyBulkValuation('mrp', e.target.value)} placeholder="SYNC MRP" className="bg-transparent border-b border-white/10 px-2 py-2 text-[10px] font-bold text-white outline-none focus:border-secondary transition-all" />
                    <input type="number" onChange={(e) => applyBulkValuation('price', e.target.value)} placeholder="SYNC PRICE" className="bg-transparent border-b border-white/10 px-2 py-2 text-[10px] font-bold text-white outline-none focus:border-secondary transition-all" />
                  </div>
                  <p className="hidden md:block text-[8px] text-primary/40 uppercase tracking-widest text-right">Applies to all active rows</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-4">
                {sizes.map((s, idx) => (
                  <div key={idx} className="bg-surface border border-outline-variant/30 p-8 space-y-8 relative group">
                    {sizes.length > 1 && (<button type="button" onClick={() => removeSizeField(idx)} className="absolute top-4 right-4 text-primary/30 hover:text-error transition-colors"><span className="material-symbols-outlined">delete</span></button>)}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Archive Size</label>
                        <select value={s.size} onChange={(e) => handleSizeChange(idx, 'size', e.target.value)} className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary appearance-none cursor-pointer uppercase text-sm">
                          <option value="">SELECT</option>
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Units</label>
                        <input type="number" value={s.stock} onChange={(e) => handleSizeChange(idx, 'stock', e.target.value)} className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Market Price (MRP)</label>
                        <input type="number" value={s.mrp} onChange={(e) => handleSizeChange(idx, 'mrp', e.target.value)} className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary text-sm" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Selling Price</label>
                        <input type="number" value={s.price} onChange={(e) => handleSizeChange(idx, 'price', e.target.value)} className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-secondary font-bold font-label outline-none focus:border-secondary text-sm" required />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Visual Archive</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} onClick={() => setPreviewIdx(idx)} className={`relative aspect-[3/4] bg-surface-container-high border-2 transition-all cursor-pointer group overflow-hidden ${previewIdx === idx ? 'border-secondary' : 'border-white/10 opacity-70 hover:opacity-100'}`}>
                    <Image src={img} alt={`Upload ${idx}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-between gap-1">
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(idx, 'left'); }} disabled={idx === 0} className="bg-white/10 hover:bg-secondary w-7 h-7 flex items-center justify-center disabled:opacity-20"><span className="material-symbols-outlined text-[14px]">west</span></button>
                        {idx !== 0 && (
                          <button type="button" onClick={(e) => { e.stopPropagation(); setAsPrimary(idx); }} className="bg-secondary/20 hover:bg-secondary text-[8px] font-bold tracking-widest uppercase flex-1 h-7 flex items-center justify-center">MAKE PRIMARY</button>
                        )}
                        <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(idx, 'right'); }} disabled={idx === images.length - 1} className="bg-white/10 hover:bg-secondary w-7 h-7 flex items-center justify-center disabled:opacity-20"><span className="material-symbols-outlined text-[14px]">east</span></button>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="bg-error/80 hover:bg-error w-full py-1.5 text-[8px] font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[12px]">delete</span>
                        Remove
                      </button>
                    </div>
                    {idx === 0 && <div className="absolute bottom-0 left-0 right-0 bg-secondary/80 text-on-secondary text-[7px] font-black py-1 text-center tracking-tighter uppercase backdrop-blur-sm">Primary Asset</div>}
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="cursor-pointer aspect-[3/4] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-all text-primary/40 group"><span className="material-symbols-outlined">add_a_photo</span><input type="file" multiple onChange={uploadFileHandler} className="hidden" disabled={uploading} /></label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Detailed Brief</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all resize-none" required></textarea>
            </div>

            <div className="pt-8 flex gap-6">
              <button type="submit" disabled={loading || uploading} className="bg-secondary px-12 py-5 text-on-secondary font-label text-sm font-black tracking-[0.3em] hover:bg-white transition-all uppercase disabled:opacity-50">COMMIT CHANGES</button>
              <button type="button" onClick={() => router.back()} className="border border-outline-variant px-12 py-5 text-primary font-label text-sm font-black tracking-[0.3em] hover:border-white transition-all uppercase">ABORT</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
