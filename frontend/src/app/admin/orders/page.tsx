"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';
import Image from 'next/image';

export default function OrdersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('/api/orders/all', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <section className="p-12">
      <div className="bg-surface-container-low">
        <div className="p-8 border-b border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-white">System Orders</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-label tracking-widest text-primary uppercase animate-pulse">Syncing with Order Ledger...</div>
          ) : (
            <table className="w-full text-left font-label">
              <thead>
                <tr className="text-[10px] text-primary/50 tracking-[0.3em] uppercase border-b border-outline-variant/10">
                  <th className="px-8 py-6 font-normal">Order ID</th>
                  <th className="px-8 py-6 font-normal">Customer</th>
                  <th className="px-8 py-6 font-normal">Date</th>
                  <th className="px-8 py-6 font-normal text-right">Total</th>
                  <th className="px-8 py-6 font-normal text-center">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-xs text-white font-mono uppercase tracking-tight">#{order._id.substring(18)}</td>
                    <td className="px-8 py-6">
                      <p className="text-white text-sm font-bold">{order.user_id?.name || 'Guest'}</p>
                      <p className="text-[10px] text-primary uppercase">{order.user_id?.email || 'N/A'}</p>
                    </td>
                    <td className="px-8 py-6 text-xs text-primary">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right font-bold text-white text-sm">₹{order.totalPrice.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold tracking-widest ${order.isPaid ? 'bg-secondary-container/20 text-secondary' : 'bg-tertiary-container/20 text-tertiary'}`}>
                        {order.isPaid ? 'PAID' : 'PENDING'}
                      </span>
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
