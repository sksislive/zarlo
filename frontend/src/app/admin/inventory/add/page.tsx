"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AddProductPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [shippingCharges, setShippingCharges] = useState('0');
  const [taxes, setTaxes] = useState('0');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewIdx, setPreviewIdx] = useState(0);

  // Advanced Size & Price State
  const [sizes, setSizes] = useState([{ size: 'S', stock: '', mrp: '', price: '' }]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
        if (data.length > 0) setCategory(data[0].name);
      } catch (error) { console.error(error); }
    };
    fetchCategories();
  }, []);

  const addSizeField = () => {
    setSizes([...sizes, { size: '', stock: '', mrp: '', price: '' }]);
  };

  const selectAllSizes = () => {
    const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => ({
      size: s, stock: '', mrp: '', price: ''
    }));
    setSizes(standardSizes);
  };

  const removeSizeField = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, field: string, value: string) => {
    const newSizes = [...sizes];
    (newSizes[index] as any)[field] = value;
    setSizes(newSizes);
  };

  const applyBulkValuation = (field: string, value: string) => {
    const updated = sizes.map(s => ({ ...s, [field]: value }));
    setSizes(updated);
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
      toast.success('ARCHIVE EXPANDED');
    } catch (error) { toast.error('UPLOAD FAILED'); }
    setUploading(false);
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

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('IMAGES REQUIRED'); return; }

    const validSizes = sizes.filter(s => s.size && s.stock !== '');
    if (validSizes.length === 0) {
      toast.error('REQUIRED: MINIMUM 1 SIZE ALLOCATION');
      return;
    }

    setLoading(true);
    try {
      const mainMrp = validSizes[0].mrp || 0;
      const mainPrice = validSizes[0].price || 0;

      await axios.post('/api/products', {
        name,
        description,
        sellingPrice: Number(mainMrp),
        discountPrice: Number(mainPrice),
        category,
        sizes: validSizes.map(s => ({
          size: s.size,
          stock: Number(s.stock),
          mrp: Number(s.mrp),
          price: Number(s.price)
        })),
        shippingCharges: Number(shippingCharges),
        taxes: Number(taxes),
        images: images,
        status: 'approved'
      }, { headers: { Authorization: `Bearer ${user?.token}` } });

      toast.success('PRODUCT BROADCAST SUCCESSFUL');
      router.push('/admin/inventory');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'DEPLOYMENT FAILED');
    }
    setLoading(false);
  };

  const totalCalculatedStock = sizes.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);

  return (
    <section className="p-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1600px] mx-auto">

        <div className="lg:col-span-8 bg-surface-container-low p-10 border border-white/5 h-fit">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline text-2xl font-black uppercase tracking-widest text-white">New Product Protocol</h3>
            <div className="flex items-center gap-4 bg-surface px-4 py-2 border border-secondary/20">
              <span className="text-[9px] font-bold text-primary/60 tracking-widest uppercase">Archive Volume</span>
              <span className="text-secondary font-headline text-lg font-bold">{totalCalculatedStock} UNITS</span>
            </div>
          </div>

          <form onSubmit={submitHandler} className="space-y-12">
            {/* Base Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-1 space-y-2">
                <label className="font-label text-xs tracking-widest text-primary uppercase">Product Identification</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all uppercase" placeholder="ENTRY NAME" required />
              </div>

              <div className="space-y-2">
                <label className="font-label text-xs tracking-widest text-primary uppercase">Category Protocol</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all appearance-none uppercase" required>
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

            {/* Inventory & Pricing Architecture */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-4 gap-4">
                <div className="space-y-1">
                  <label className="font-label text-xs tracking-widest text-secondary uppercase font-bold">Inventory & Valuation</label>
                  <p className="text-[9px] text-primary/40 uppercase tracking-tighter italic">Define per size, or use bulk sync below</p>
                </div>
                <div className="flex flex-wrap gap-4">
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
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => removeSizeField(idx)} className="absolute top-4 right-4 text-primary/30 hover:text-error transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {/* Size Select */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Archive Size</label>
                        <select
                          value={s.size}
                          onChange={(e) => handleSizeChange(idx, 'size', e.target.value)}
                          className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary appearance-none cursor-pointer uppercase text-sm"
                        >
                          <option value="">SELECT</option>
                          {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE SIZE'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                        </select>
                      </div>

                      {/* Units */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Units (Stock)</label>
                        <input type="number" value={s.stock} onChange={(e) => handleSizeChange(idx, 'stock', e.target.value)} placeholder="0" className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary text-sm" required />
                      </div>

                      {/* MRP */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Market Price (MRP)</label>
                        <input type="number" value={s.mrp} onChange={(e) => handleSizeChange(idx, 'mrp', e.target.value)} placeholder="₹ 0.00" className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary text-sm" required />
                      </div>

                      {/* Discounted Price */}
                      <div className="space-y-2">
                        <label className="text-[10px] text-primary/60 tracking-widest uppercase font-bold">Selling Price</label>
                        <input type="number" value={s.price} onChange={(e) => handleSizeChange(idx, 'price', e.target.value)} placeholder="₹ 0.00" className="w-full bg-surface-container-high border border-outline-variant px-4 py-3 text-secondary font-bold font-label outline-none focus:border-secondary text-sm" required />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* visuals */}
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
                  <label className="cursor-pointer aspect-[3/4] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-all text-primary/40 hover:text-secondary group">
                    <span className="material-symbols-outlined">add_a_photo</span>
                    <input type="file" multiple onChange={uploadFileHandler} className="hidden" disabled={uploading} />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label text-xs tracking-widest text-primary uppercase">Detailed Brief</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-surface border border-outline-variant px-4 py-3 text-white font-label outline-none focus:border-secondary transition-all resize-none" required></textarea>
            </div>

            <div className="pt-8 flex gap-6">
              <button type="submit" disabled={loading || uploading} className="bg-secondary px-12 py-5 text-on-secondary font-label text-sm font-black tracking-[0.3em] hover:bg-white transition-all uppercase disabled:opacity-50">COMMIT TO VAULT</button>
              <button type="button" onClick={() => router.back()} className="border border-outline-variant px-12 py-5 text-primary font-label text-sm font-black tracking-[0.3em] hover:border-white transition-all uppercase">ABORT</button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-4 sticky top-36 h-fit hidden lg:block">
          <div className="bg-surface-container-low border border-white/5 p-8 space-y-8">
            <h4 className="font-headline text-sm font-bold uppercase tracking-widest text-primary/50">Live Archive Preview</h4>
            <div className="aspect-[3/4] relative bg-surface-container-high">
              {images[previewIdx] ? <Image src={images[previewIdx]} alt="Preview" fill className="object-cover" /> : null}
            </div>
            <div className="space-y-4">
              <h2 className="font-headline text-2xl font-black text-white uppercase">{name || 'IDENTIFICATION'}</h2>
              <div className="flex gap-4 items-end">
                <span className="text-secondary font-headline text-xl font-bold">₹ {sizes[0].price || '0'}</span>
                <span className="text-primary/30 font-label text-sm line-through">₹ {sizes[0].mrp || '0'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
