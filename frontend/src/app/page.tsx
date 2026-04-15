import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../components/ProductCard';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-surface-container-lowest">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC36PjQ3ypqH2MtPLWJbeOKsApXyVX4OpnNdrHUkF-Hxp3-Yhs2XGqe4bBe8sUfx4Pqjm7ohYp3JwunkZj_pAJMfBNWTBSfDkVmtP3ZEv_xMD1ZoD4rvUMg4FpTGj89AE-uymBoTnd8O_9EpdxFFzFpoPYcQZp8l89aYdeXEhzt7J9oIa3nYxPACzoMXaxVFa6uSWVSBPcRqfBe-Mr3gNbce6oYHUXX0BKM9_FJUaD4I_Gaerth2ATTRc0RT082qZTAtTa55GGU7qdo" 
            alt="Luxury streetwear" 
            fill 
            sizes="100vw"
            className="object-cover opacity-60 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80"></div>
        </div>
        <div className="relative z-10 text-center px-6 pt-24">
          <h1 className="font-headline font-black text-6xl md:text-8xl lg:text-9xl uppercase tracking-tighter leading-[0.85] mb-8">
            OWN YOUR STYLE <br/> <span className="text-secondary">WITH ZARLO</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link href="/products?category=mens" className="bg-secondary text-on-secondary px-12 py-5 font-label font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto text-center">
              Shop Men
            </Link>
            <Link href="/products?category=womens" className="border border-white/20 bg-surface/40 backdrop-blur-md text-white px-12 py-5 font-label font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 w-full md:w-auto text-center">
              Shop Women
            </Link>
          </div>
        </div>
      </section>

      {/* Collections Bento Grid */}
      <section className="bg-surface py-32 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[1200px] md:h-[800px] max-w-7xl mx-auto">
          <Link href="/products?category=new" className="md:col-span-8 relative group overflow-hidden bg-surface-container flex flex-col justify-end">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZq3mvkgSsU6N3JMySfdGTr5WLqXjJivIAflYt_ZX0CFgLaMY6I_UjEpGOCB3Zjd5IBomLID0xh-Kc6roZx8gbujA1axwvWI5RHUU3TpKADMYlRkVmhEdOB_qEVUgRMLI206f8oa0i4G_0UaTxFXhw2rBvLOUsG1h3gxpfDJ84KcJCamuExCpd9YSWnToDYr7nqHQiQWMrFDOGf0N6KgAQuDEpwgyg1B4OCXkTvqatGyWaARn0tBmLJDm1Dttxvt1yebSxayCRN4-q" alt="New Arrivals" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <span className="font-label text-tertiary text-sm tracking-[0.3em] mb-2 uppercase">CURATED DROPS</span>
              <h2 className="font-headline text-5xl font-black uppercase text-white">NEW ARRIVALS</h2>
              <span className="mt-6 text-white font-label tracking-widest uppercase border-b border-white w-fit pb-1 hover:text-secondary hover:border-secondary transition-all">Explore Drop</span>
            </div>
          </Link>
          <Link href="/products?category=womens" className="md:col-span-4 relative group overflow-hidden bg-surface-container-high flex flex-col justify-end">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9r8fPm9UnCWe6PqE6nGqN5Hbi3l1L-4O8RT-kD04PdIR3oWTFf-WM269wU3psWQJnFlz1eMW6hIcJNNp6oX_cvoXQgp4-zn2_ltmePrNcS9xJKx-hTlTpknxLhGce9CCLNs_905PR3u3W-KTcwkkJrPI5SRFTyAJEMmY9XaMY1UOxmJFxHFd8b-hZp7GzNmpN5uxrhY0AdRWx4lcfDu9aeTPcdROxZxVnQq4RdPVbtsDj7gs_rGRJlIzaFQpE83VKgFT3HrLQzrHE" alt="Women" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="font-headline text-3xl font-black uppercase text-white">WOMEN</h2>
              <span className="mt-4 text-white font-label tracking-widest uppercase text-xs">Shop Selection</span>
            </div>
          </Link>
          <Link href="/products?category=mens" className="md:col-span-4 relative group overflow-hidden bg-surface-container-high flex flex-col justify-end">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIyxg4UM7a-Vkpfnj38mxZDdY4-JbWFrR-dgEwC9M9jXqap5pwArwQxJR0y03rDnCefHsBmSynocVa6nNiHwKYNVjF5GI_WEOHT_VFxmCBal8-tLrEDOQfcnzRt1bWnTVLPr52-j0rNXRCzlQvro_Oe3TfLaIpCVuE1vEy9h4oYfAxvDcmwQ8B7oooXQN3R416DQ460ocb9qC6xIuUEXdimw6k6ERD86L59hByvfKibJBC19rOpokTw7l3_FL9ddxXfA9OeaQxfh6j" alt="Men" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="font-headline text-3xl font-black uppercase text-white">MEN</h2>
              <span className="mt-4 text-white font-label tracking-widest uppercase text-xs">Shop Selection</span>
            </div>
          </Link>
          <Link href="/products" className="md:col-span-8 relative group overflow-hidden bg-surface-container flex flex-col justify-end">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOp-8BVxDmWXxUQtOgl2xWOctKEIdPbTFz5l2WFA_VAwlgeDYTd25sU0sMuQriqzeFg80QNTeXVXYe_g_iAYzJWFnFrFfPsaWP6RVE_ejU_4pJWe7GgmK0NaNQ8dsvn6QcFPKQwC4tbWG--HXKOoJRaJ9WhRcUOoXT6fnto8HqqHRHdcoGk-Ng18wUgA6FBF1YlNdhekrnPSDZ1KX3Er7niA6YXZnS2SUXLtwuZ11s2YY-wYM3I55D2_P8K5DZWwyojwzRH4uIYmNM" alt="Collections" fill sizes="(max-width: 768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
            <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
              <h2 className="font-headline text-4xl font-black uppercase text-white">COLLECTIONS</h2>
              <span className="mt-4 text-white font-label tracking-widest uppercase border-b border-white w-fit pb-1">View Archive</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="bg-surface-container-lowest py-16 overflow-hidden flex items-center border-y border-white/5">
        {/* Placeholder marquee, uses CSS animation or simply tailwind loops */}
        <div className="flex animate-[pulse_5s_linear_infinite] w-full">
          <div className="flex gap-20 items-center px-10 w-full justify-around">
            <span className="text-tertiary font-headline text-5xl md:text-8xl font-black tracking-tighter">FLAT 30% OFF</span>
            <span className="text-outline font-headline text-5xl md:text-8xl font-black tracking-tighter opacity-20">ZARLO WINTER</span>
            <span className="text-tertiary font-headline text-5xl md:text-8xl font-black tracking-tighter hidden md:block">LIMIT DROP</span>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="bg-surface-container-low py-40 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <span className="font-label text-tertiary text-sm tracking-[0.4em] uppercase mb-6 block">Our Ethos</span>
            <h2 className="font-headline text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-8">ARCHITECTS <br/> OF MODERN <br/> ARMOR.</h2>
            <p className="font-body text-xl text-primary leading-relaxed max-w-lg">
              ZARLO is not a fashion brand. It is an exploration of the intersection between industrial design, technical utility, and avant-garde luxury. We create silhouettes for the modern nomad who demands performance and prestige in equal measure.
            </p>
            <div className="mt-12">
              <button className="bg-primary text-on-primary px-10 py-4 font-label font-bold tracking-[0.2em] uppercase hover:bg-secondary hover:text-on-secondary transition-all">READ THE MANIFESTO</button>
            </div>
          </div>
          <div className="relative h-[600px] w-full">
            <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBKi20mz9Chsr4qCoperUL3lm4DZH28FtZVKaQNHBwBbO4rfDXaAtg-MAJi25-L-keFsNnzddezTEM1m9LdELXJYZ1Pc0tTWsdoGmK_QyOl_RemVh6JiDU49or7Vm6JubYDFkP_2lPCdfFZEMu-dN3_lQ4AC9fh9BEz6QmeStI74PlKdksbxsAb1kJdxW-TlPBQ0KJRMu6CldQnjXSsII0Fo_9DRJ8okaw6Te4ZlGC_1OzPTEE_Im436rmUIZ68JQdcLTilkuEsomK" alt="Design Ethos" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover grayscale brightness-75" />
            <div className="absolute -bottom-10 -right-10 hidden lg:block">
              <div className="bg-secondary p-12 text-on-secondary w-64 h-64 flex flex-col justify-center items-center text-center">
                <span className="font-headline text-5xl font-black">EST.</span>
                <span className="font-headline text-4xl font-black">2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
