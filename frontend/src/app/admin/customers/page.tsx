"use client";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import axios from 'axios';

export default function CustomersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);
  
  const fetchCustomers = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } };
      const { data } = await axios.get('/api/auth/users', config);
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <section className="p-12">
      <div className="bg-surface-container-low">
        <div className="p-8 border-b border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold uppercase tracking-widest text-white">Member Directory</h3>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center font-label tracking-widest text-primary uppercase animate-pulse">Scanning Bio-Profiles...</div>
          ) : (
            <table className="w-full text-left font-label">
              <thead>
                <tr className="text-[10px] text-primary/50 tracking-[0.3em] uppercase border-b border-outline-variant/10">
                  <th className="px-8 py-6 font-normal">Ident-Code</th>
                  <th className="px-8 py-6 font-normal">Full Name</th>
                  <th className="px-8 py-6 font-normal">Email Address</th>
                  <th className="px-8 py-6 font-normal text-center">Protocol Role</th>
                  <th className="px-8 py-6 font-normal text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {customers.map((cust: any) => (
                  <tr key={cust._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6 text-xs text-primary font-mono select-all">#{cust._id.substring(18).toUpperCase()}</td>
                    <td className="px-8 py-6 text-white font-bold text-sm tracking-widest uppercase">{cust.name}</td>
                    <td className="px-8 py-6 text-xs text-primary lowecase">{cust.email}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 text-[10px] font-bold tracking-widest ${cust.role === 'admin' ? 'bg-secondary text-on-secondary' : 'bg-surface-container-high text-primary'}`}>
                        {cust.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right text-xs text-primary/50">{new Date(cust.createdAt).toLocaleDateString()}</td>
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
