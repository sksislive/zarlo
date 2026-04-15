"use client";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeFromCart, updateQty } from '../../redux/slices/cartSlice';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalShipping = cartItems.reduce((acc, item) => acc + (item.shippingCharges || 0), 0);
  const total = subtotal + totalShipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-24 space-y-6">
        <h2 className="font-headline text-3xl font-black tracking-tight text-white uppercase italic">YOUR BAG IS EMPTY</h2>
        <Link href="/products" className="font-label text-xs tracking-widest text-primary uppercase border-b border-primary hover:text-white hover:border-white transition-colors pb-1">
          RETURN TO ARCHIVE
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-7 space-y-20">
          <section id="cart-list">
            <h2 className="font-headline text-3xl font-black tracking-tight mb-10 text-white uppercase italic">
              YOUR BAG [{cartItems.length < 10 ? `0${cartItems.length}` : cartItems.length}]
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product} className="flex flex-col md:flex-row gap-6 p-6 bg-surface-container-low group transition-all duration-300">
                  <div className="w-full md:w-32 h-40 bg-surface-container-high overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-all duration-700"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-label text-[10px] text-secondary tracking-[0.2em] mb-1">ARCHIVE ITEM</p>
                        <h3 className="font-headline font-bold text-lg text-white uppercase">{item.name}</h3>
                        <p className="font-body text-sm text-on-surface-variant">Size: M | Class: Standard</p>
                      </div>
                      <p className="font-label text-lg font-bold">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-outline-variant/30 px-3 py-1 bg-surface-container-high">
                        <button
                          onClick={() => dispatch(updateQty({ product: item.product, qty: Math.max(1, item.qty - 1) }))}
                          className="material-symbols-outlined text-sm hover:text-secondary text-primary"
                        >
                          remove
                        </button>
                        <span className="mx-6 font-label text-sm text-white">{item.qty < 10 ? `0${item.qty}` : item.qty}</span>
                        <button
                          onClick={() => dispatch(updateQty({ product: item.product, qty: item.qty + 1 }))}
                          className="material-symbols-outlined text-sm hover:text-secondary text-primary"
                        >
                          add
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.product))}
                        className="font-label text-[10px] tracking-widest text-error hover:underline uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-32 space-y-8">
            <div className="bg-surface-container-high p-8 border-t-2 border-secondary">
              <h2 className="font-headline text-xl font-bold mb-8 tracking-widest uppercase text-white">ORDER SUMMARY</h2>
              <div className="space-y-4 font-label text-sm mb-8 relative">
                <div className="flex justify-between text-on-surface-variant">
                  <span>SUBTOTAL</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>ESTIMATED SHIPPING</span>
                  <span>{totalShipping > 0 ? `₹${totalShipping.toLocaleString('en-IN')}` : 'FREE'}</span>
                </div>
                <div className="h-px bg-outline-variant/20 my-4"></div>
                <div className="flex justify-between text-2xl font-bold text-white font-headline tracking-tighter">
                  <span>TOTAL</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout" className="block text-center w-full py-6 bg-secondary text-on-secondary font-headline font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
                  PROCEED TO SECURE CHECKOUT
                </Link>
                <p className="text-center font-body text-[10px] text-on-surface-variant opacity-60 px-4">
                  BY PROCEEDING, YOU AGREE TO ZARLO'S TERMS OF SERVICE AND PRIVACY POLICY.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-white/5 opacity-50 grayscale">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <p className="font-label text-[10px] tracking-widest uppercase">SECURE SSL ENCRYPTED TRANSACTION</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
