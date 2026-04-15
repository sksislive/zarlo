"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import React from 'react';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = React.use(searchParams);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = params.category ? `?category=${params.category}` : '';
        const { data } = await axios.get(`/api/products${query}`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params.category]);

  return (
    <div className="flex w-full min-h-screen pt-24">
      {/* Sidebar Filters */}
      <aside className="hidden lg:flex flex-col w-80 fixed left-0 top-24 bottom-0 bg-surface-container-lowest border-r border-white/5 px-12 py-12 overflow-y-auto hide-scrollbar z-10">
        <div className="mb-12">
          <h3 className="font-headline font-black uppercase tracking-widest text-white text-xs mb-8">CATEGORY</h3>
          <div className="space-y-4 font-label text-xs tracking-widest text-primary">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-none bg-surface-container border-outline-variant text-secondary focus:ring-0 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">OUTERWEAR</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-none bg-surface-container border-outline-variant text-secondary focus:ring-0 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">KNITWEAR</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-none bg-surface-container border-outline-variant text-secondary focus:ring-0 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">FOOTWEAR</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-none bg-surface-container border-outline-variant text-secondary focus:ring-0 focus:ring-offset-0" />
              <span className="group-hover:text-white transition-colors">ACCESSORIES</span>
            </label>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="font-headline font-black uppercase tracking-widest text-white text-xs mb-8">SIZE</h3>
          <div className="grid grid-cols-3 gap-2 font-label text-xs">
            <button className="py-3 border border-outline-variant hover:border-secondary transition-colors text-white">XS</button>
            <button className="py-3 border border-outline-variant hover:border-secondary transition-colors text-white">S</button>
            <button className="py-3 border border-secondary text-secondary">M</button>
            <button className="py-3 border border-outline-variant hover:border-secondary transition-colors text-white">L</button>
            <button className="py-3 border border-outline-variant hover:border-secondary transition-colors text-white">XL</button>
            <button className="py-3 border border-outline-variant text-outline-variant cursor-not-allowed">XXL</button>
          </div>
        </div>
        <div className="mb-12">
          <h3 className="font-headline font-black uppercase tracking-widest text-white text-xs mb-8">PRICE RANGE</h3>
          <div className="space-y-6">
            <input type="range" className="w-full h-1 bg-surface-container-high appearance-none cursor-pointer accent-secondary" />
            <div className="flex justify-between font-label text-[10px] text-primary tracking-widest">
              <span>₹100</span>
              <span>₹25,000</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid Content */}
      <section className="flex-1 lg:ml-80 px-6 lg:px-12 py-12">
        {/* Header & Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div>
            <h1 className="font-headline font-black text-6xl tracking-tighter uppercase text-white mb-2">
              {params.category ? params.category : 'COLLECTION'}
            </h1>
            <p className="font-label text-sm tracking-widest text-primary uppercase">CURATED DROPS / SEASON 04</p>
          </div>
          <div className="flex items-center gap-8 border-b border-outline-variant pb-2 min-w-[200px]">
            <span className="font-label text-[10px] text-primary tracking-widest">SORT BY</span>
            <select className="bg-transparent border-none focus:ring-0 font-label text-xs text-white uppercase tracking-widest appearance-none cursor-pointer p-0 pr-8 outline-none z-10">
              <option className="bg-surface text-white">NEWEST RELEASES</option>
              <option className="bg-surface text-white">PRICE HIGH-LOW</option>
              <option className="bg-surface text-white">PRICE LOW-HIGH</option>
              <option className="bg-surface text-white">MOST POPULAR</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="col-span-full py-20 text-center font-label tracking-[0.3em] uppercase text-secondary">
            Loading Archive...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center font-label tracking-[0.3em] uppercase text-outline">
            No items found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-y-20 gap-x-12">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-32 flex justify-between items-center border-t border-outline-variant pt-12 font-label text-xs tracking-[0.3em] text-primary">
          <button className="hover:text-secondary transition-colors uppercase">PREVIOUS</button>
          <div className="flex gap-8">
            <button className="text-white">01</button>
            <button className="hover:text-white transition-colors">02</button>
            <span className="text-outline-variant">...</span>
          </div>
          <button className="hover:text-secondary transition-colors uppercase">NEXT</button>
        </div>
      </section>
    </div>
  );
}
