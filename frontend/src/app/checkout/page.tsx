"use client";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveShippingAddress, clearCart } from '../../redux/slices/cartSlice';
import Script from 'next/script';
import Image from 'next/image';

export default function Checkout() {
  const { cartItems, shippingAddress } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || 'India');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = cartItems.reduce((acc, item) => acc + (item.shippingCharges || 0), 0);
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePayment = async () => {
    if (!address || !city || !postalCode || !country) {
      toast.error('COMPLETE ALL SHIPPING FIELDS');
      return;
    }

    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    setLoading(true);

    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data: orderData } = await axios.post('/api/orders', {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: 'Razorpay',
        itemsPrice, taxPrice, shippingPrice, totalPrice
      }, config);

      const { data: razorpayData } = await axios.post('/api/payments/create', {
        amount: Math.round(totalPrice),
        orderId: orderData._id
      }, config);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_change_this',
        amount: razorpayData.amount,
        currency: "INR",
        name: "ZARLO Noir et Or",
        description: "Official Digital Flagship Checkout",
        order_id: razorpayData.id,
        handler: async function (response: any) {
          try {
            await axios.post('/api/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: orderData._id
            }, config);
            toast.success("TRANSACTION SECURED.", {
              style: { borderRadius: '0px', background: '#131313', color: '#eac169' },
            });
            dispatch(clearCart());
            router.push('/dashboard');
          } catch (err) {
            toast.error("VERIFICATION FAILED");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: "9999999999"
        },
        theme: { color: "#eac169" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        toast.error(`TERMINATED: ${response.error.description}`);
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'AUTHORIZATION ERROR');
    }
    setLoading(false);
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Checkout Form */}
          <div className="lg:col-span-7 space-y-20">
            {/* Section 1: Shipping */}
            <section id="shipping-details">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-headline text-4xl font-black text-secondary/20">01</span>
                <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-wider">SHIPPING INFORMATION</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group">
                  <label className="block font-label text-[10px] text-primary tracking-widest mb-2 uppercase">First Name</label>
                  <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" placeholder="ENTER FIRST NAME" type="text"/>
                </div>
                <div className="relative group">
                  <label className="block font-label text-[10px] text-primary tracking-widest mb-2 uppercase">Last Name</label>
                  <input value={lastName} onChange={(e)=>setLastName(e.target.value)} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" placeholder="ENTER LAST NAME" type="text"/>
                </div>
                <div className="md:col-span-2 relative group">
                  <label className="block font-label text-[10px] text-primary tracking-widest mb-2 uppercase">Delivery Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" placeholder="STREET ADDRESS, APARTMENT, SUITE" type="text"/>
                </div>
                <div className="relative group">
                  <label className="block font-label text-[10px] text-primary tracking-widest mb-2 uppercase">City</label>
                  <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" placeholder="CITY" type="text"/>
                </div>
                <div className="relative group">
                  <label className="block font-label text-[10px] text-primary tracking-widest mb-2 uppercase">Postal Code</label>
                  <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full bg-transparent border-b border-outline-variant focus:border-secondary focus:ring-0 px-0 py-2 transition-colors font-body text-white outline-none" placeholder="000 000" type="text"/>
                </div>
              </div>
            </section>

            {/* Section 2: Payment */}
            <section id="payment-method">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="font-headline text-4xl font-black text-secondary/20">02</span>
                <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-wider">PAYMENT METHOD</h2>
              </div>
              <div className="space-y-4">
                {/* Razorpay Highlighted Option */}
                <div className="p-6 bg-secondary/10 border border-secondary flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-6 h-6 border-2 border-secondary flex items-center justify-center p-1">
                      <div className="w-full h-full bg-secondary"></div>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-white tracking-widest">RAZORPAY GATEWAY</h4>
                      <p className="font-body text-xs text-on-surface-variant">Cards, UPI, Netbanking, & Wallets</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="material-symbols-outlined text-secondary" data-icon="credit_card">credit_card</span>
                    <span className="material-symbols-outlined text-secondary" data-icon="account_balance">account_balance</span>
                  </div>
                </div>
                
                {/* Secondary Option */}
                <div className="p-6 bg-surface-container border border-white/5 flex items-center justify-between cursor-pointer hover:bg-surface-container-high transition-colors opacity-50">
                  <div className="flex items-center gap-6">
                    <div className="w-6 h-6 border border-outline-variant"></div>
                    <div>
                      <h4 className="font-headline font-bold text-primary tracking-widest">CASH ON DELIVERY</h4>
                      <p className="font-body text-xs text-on-surface-variant">Not available for Archive Drops</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary" data-icon="local_shipping">local_shipping</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8">
              <div className="bg-surface-container-high p-8 border-t-2 border-secondary">
                <h2 className="font-headline text-xl font-bold mb-8 tracking-widest uppercase text-white">ORDER SUMMARY</h2>
                
                <div className="flex flex-col gap-4 border border-outline-variant/30 rounded-none p-4 mb-8 bg-surface-container-low max-h-[300px] overflow-y-auto no-scrollbar">
                  {cartItems.map(item => (
                    <div key={item.product} className="flex justify-between items-center text-sm">
                      <div className="font-medium text-white line-clamp-1">{item.name} <span className="text-secondary tracking-widest">[{item.qty}]</span></div>
                      <div className="font-bold text-primary">₹{(item.price * item.qty).toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 font-label text-sm mb-8">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>SUBTOTAL</span>
                    <span>₹{itemsPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>ESTIMATED SHIPPING</span>
                    <span>{shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>TAXES (GST 18%)</span>
                    <span>₹{taxPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px bg-outline-variant/20 my-4"></div>
                  <div className="flex justify-between text-2xl font-bold text-white font-headline tracking-tighter">
                    <span>TOTAL</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={handlePayment} 
                    disabled={loading}
                    className="w-full py-6 bg-secondary text-on-secondary font-headline font-black tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'AUTHORIZING...' : 'COMPLETE PURCHASE'}
                  </button>
                  <p className="text-center font-body text-[10px] text-on-surface-variant opacity-60 px-4">
                    BY CLICKING COMPLETE PURCHASE, YOU AGREE TO ZARLO'S TERMS OF SERVICE AND PRIVACY POLICY.
                  </p>
                </div>
              </div>
              
              {/* Security Badge */}
              <div className="flex items-center gap-4 p-4 border border-white/5 opacity-50">
                <span className="material-symbols-outlined text-primary" data-icon="verified_user">verified_user</span>
                <p className="font-label text-[10px] tracking-widest">SECURE SSL ENCRYPTED TRANSACTION PROVIDER</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
