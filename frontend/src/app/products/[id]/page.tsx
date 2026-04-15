"use client";
import React, { useEffect, useState, use } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';
import toast from 'react-hot-toast';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${resolvedParams.id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
            const firstInStock = data.sizes.find((s: any) => s.stock > 0) || data.sizes[0];
            setSelectedSize(firstInStock.size);
        }
        setLoading(false);
      } catch (error) { console.error(error); setLoading(false); }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  const currentSizeData = product?.sizes?.find((s: any) => s.size === selectedSize);
  
  // Use size-specific price if available, fallback to global prices
  const actualPrice = currentSizeData?.price || product?.discountPrice || 0;
  const originalPrice = currentSizeData?.mrp || product?.sellingPrice || 0;
  const isDiscounted = originalPrice > actualPrice;

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('SELECT A SIZE'); return; }
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images[0] || '',
      price: actualPrice,
      qty: 1, 
      size: selectedSize,
      shippingCharges: product.shippingCharges || 0
    }));
    toast.success('ITEM SECURED.', { style: { borderRadius: '0px', background: '#131313', color: '#eac169' } });
  };

  if (loading) return <div className="py-40 min-h-screen text-center font-label tracking-[0.3em] uppercase text-secondary">Loading Archive...</div>;
  if (!product) return <div className="py-40 min-h-screen text-center font-label tracking-[0.3em] uppercase text-error">Asset Not Found</div>;

  return (
    <div className="pt-24 min-h-screen">
      <section className="grid grid-cols-1 md:grid-cols-12 gap-0 max-w-[1600px] mx-auto">
        <div className="md:col-span-7 grid grid-cols-1 gap-2">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="relative w-full aspect-[4/5] bg-surface-container-low hidden md:block">
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {product.images.slice(1, 5).map((img: string, idx: number) => (
                  <div key={idx} className="relative w-full aspect-square bg-surface-container-low">
                    <Image src={img} alt={`${product.name} visual ${idx + 2}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="w-full aspect-[4/5] bg-surface-container-low flex justify-center items-center">
              <span className="font-label text-outline tracking-widest uppercase">Classified Imagery</span>
            </div>
          )}
        </div>

        <div className="md:col-span-5 px-8 md:px-16 py-12 md:sticky md:top-24 h-fit">
          <div className="flex flex-col gap-8">
            <header>
              <div className="flex justify-between items-start mb-4">
                <span className="font-label text-xs tracking-widest text-primary uppercase">{product.category} // ARCHIVE COLLECTION</span>
                {isDiscounted && (
                    <span className="bg-secondary text-on-secondary px-3 py-1 text-[10px] font-black tracking-widest uppercase italic animate-pulse">
                        SALE -{Math.round(((originalPrice - actualPrice) / originalPrice) * 100)}%
                    </span>
                )}
              </div>
              <h1 className="font-headline text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">{product.name}</h1>
              
              {/* Dynamic Price Display */}
              <div className="flex items-center gap-6">
                <p className="font-headline text-4xl text-secondary font-bold tracking-tight transition-all duration-300">
                    ₹{actualPrice.toLocaleString('en-IN')}
                </p>
                {isDiscounted && <p className="font-label text-xl text-primary/30 line-through tracking-widest transition-all duration-300">₹{originalPrice.toLocaleString('en-IN')}</p>}
              </div>
            </header>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="font-label text-xs tracking-widest uppercase font-bold text-white/40">ARCHIVE SIZE SELECTION</span>
                {currentSizeData && (
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${currentSizeData.stock < 10 ? 'text-error' : 'text-primary/40'}`}>
                        {currentSizeData.stock === 0 ? 'STATUS: DEPLETED' : currentSizeData.stock < 10 ? `CRITICAL SUPPLY [${currentSizeData.stock}]` : `In Stock [${currentSizeData.stock}]`}
                    </span>
                )}
              </div>

              {/* Horizontal Size Selector (Premium Style) */}
              <div className="flex flex-wrap gap-2">
                {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((s: any) => (
                        <button 
                            key={s.size}
                            disabled={s.stock <= 0}
                            onClick={() => setSelectedSize(s.size)}
                            className={`min-w-[70px] h-14 flex items-center justify-center font-label transition-all border
                                ${selectedSize === s.size ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-outline-variant text-white hover:border-secondary'}
                                ${s.stock <= 0 ? 'opacity-20 cursor-not-allowed grayscale' : ''}`}
                        >
                            <span className="text-sm font-black uppercase">{s.size}</span>
                        </button>
                    ))
                ) : (
                    <div className="w-full py-4 text-center border border-dashed border-outline-variant text-[10px] text-primary uppercase">No Sizes Registered</div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {(currentSizeData?.stock > 0 || product.stock > 0) ? (
                <button onClick={handleAddToCart} className="w-full bg-secondary text-on-secondary h-20 font-headline font-black uppercase tracking-widest text-lg hover:bg-white hover:text-black transition-all active:scale-[0.98]">ADD TO CART</button>
              ) : (
                <button disabled className="w-full bg-surface-container text-outline h-20 font-headline font-black uppercase tracking-widest text-lg cursor-not-allowed border border-outline-variant italic">ASSET DEPLETED</button>
              )}
              <button onClick={() => toast.success('Added to wishlist')} className="w-full border border-outline-variant text-white h-20 font-headline font-black uppercase tracking-widest text-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined">favorite</span> WISH LIST
              </button>
            </div>

            <div className="mt-8">
                <div className="bg-surface-container-low p-8 border-l-2 border-secondary">
                    <h3 className="font-headline font-bold text-xs tracking-widest mb-4 uppercase text-white/50">ARCHIVE DESCRIPTION</h3>
                    <p className="font-body text-primary/80 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
