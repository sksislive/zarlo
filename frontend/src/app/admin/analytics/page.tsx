"use client";

export default function AnalyticsPage() {
  return (
    <section className="p-12 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Revenue Chart Mockup */}
        <div className="bg-surface-container-low p-8 border border-white/5 space-y-8">
          <div className="flex justify-between items-center">
            <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Revenue Projection</h4>
            <span className="font-label text-[10px] text-secondary tracking-widest">+18.2% VS PREV MONTH</span>
          </div>
          <div className="h-64 flex items-end gap-2 px-4">
            {[40, 60, 45, 90, 65, 80, 100, 75, 95, 120].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-secondary group relative hover:brightness-125 transition-all cursor-pointer" 
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-surface px-2 py-1 text-[8px] text-white border border-white/10 z-10 transition-opacity">
                  ₹{(height * 1000).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-label text-[9px] text-primary/40 uppercase tracking-widest px-4">
            <span>JAN</span>
            <span>MAR</span>
            <span>MAY</span>
            <span>JUL</span>
            <span>SEP</span>
            <span>NOV</span>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-surface-container-low p-8 border border-white/5 space-y-8">
          <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-white">Market Share</h4>
          <div className="space-y-6">
            {[
              { label: 'Outerwear', share: 45, color: 'bg-secondary' },
              { label: 'Footwear', share: 30, color: 'bg-primary' },
              { label: 'Accessories', share: 15, color: 'bg-tertiary' },
              { label: 'Identity', share: 10, color: 'bg-surface-container-high' },
            ].map((cat) => (
              <div key={cat.label} className="space-y-2">
                <div className="flex justify-between font-label text-[10px] tracking-widest uppercase">
                  <span className="text-white">{cat.label}</span>
                  <span className="text-primary">{cat.share}%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high overflow-hidden">
                  <div className={`h-full ${cat.color} transition-all duration-1000`} style={{ width: `${cat.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-surface-container-low p-8 border border-white/5">
        <h4 className="font-headline text-lg font-bold uppercase tracking-widest text-white mb-8">Node Traffic Sources</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Direct', val: '4.2K', desc: 'Active Sessions' },
            { label: 'Organic', val: '2.8K', desc: 'Search Index' },
            { label: 'Social', val: '1.5K', desc: 'Viral Loops' },
            { label: 'Referral', val: '1.2K', desc: 'External Nodes' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-surface-container">
              <p className="font-label text-[10px] text-primary/60 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-headline text-2xl font-black text-white">{stat.val}</p>
              <p className="font-label text-[9px] text-secondary mt-2 tracking-tighter">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
