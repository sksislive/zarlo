"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price?: number;
  sellingPrice?: number;
  discountPrice?: number;
  category: string;
  images: string[];
  ratings: number;
  numReviews: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();

  const actualPrice = product.discountPrice || product.price || 0;
  const originalPrice = product.sellingPrice || product.price || 0;
  const isDiscounted = originalPrice > actualPrice;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.images && product.images[0] ? product.images[0] : '',
      price: actualPrice,
      qty: 1,
    }));
    toast.success('ITEM SECURED.', {
      style: { borderRadius: '0px', background: '#131313', color: '#eac169' },
    });
  };

  return (
    <div className="group relative bg-surface-container-low transition-all border border-transparent hover:border-surface-container-highest flex flex-col h-full">
      <Link href={`/products/${product._id}`} className="aspect-[3/4] overflow-hidden relative block bg-surface-container">
        {product.images && product.images[0] ? (
          <Image 
            src={product.images[0]} 
            alt={product.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center font-label text-xs tracking-[0.2em] uppercase text-outline">
            Classified
          </div>
        )}

        {isDiscounted && (
             <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-2 py-1 text-[8px] font-black tracking-widest uppercase italic z-10 shadow-lg">
                SALE -{Math.round(((originalPrice - actualPrice) / originalPrice) * 100)}%
             </div>
        )}
        
        {/* Hover Slide-Up Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-surface/80 backdrop-blur-md flex gap-2">
          <button onClick={handleAddToCart} className="flex-1 bg-white text-black py-3 font-label text-xs font-bold tracking-widest uppercase hover:bg-secondary hover:text-on-secondary transition-colors truncate">
            Quick Add
          </button>
          <button onClick={(e) => { e.preventDefault(); toast.success('Added to wishlist'); }} className="bg-white/10 text-white p-3 hover:bg-white hover:text-black transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined text-sm">favorite</span>
          </button>
        </div>
      </Link>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-col gap-1 mb-2">
          <Link href={`/products/${product._id}`}>
            <h3 className="font-body font-bold text-lg uppercase tracking-tight line-clamp-1 hover:text-secondary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-center gap-3">
             <span className="font-headline text-secondary text-base font-bold">₹{actualPrice.toLocaleString('en-IN')}</span>
             {isDiscounted && (
                 <span className="font-label text-[10px] text-outline line-through tracking-wider">₹{originalPrice.toLocaleString('en-IN')}</span>
             )}
          </div>
        </div>
        <p className="font-label text-[10px] text-outline tracking-wider uppercase truncate mt-auto">
          {product.category || 'ARCHIVE'} // {product._id.substring(product._id.length - 4)}
        </p>
      </div>
    </div>
  );
}
