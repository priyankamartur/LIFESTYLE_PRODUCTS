import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RotateCcw, Star, Mail } from 'lucide-react';
import apiService from '../../services/apiService';
import { getCategoryImg } from '../../utils/imageHelper';
import ProductCard from '../../components/products/ProductCard';
import Skeleton from '../../components/common/Skeleton';
import { toast } from 'react-toastify';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesData, featuredData, allProductsData] = await Promise.all([
          apiService.home.getCategories(),
          apiService.home.getFeaturedProducts(),
          apiService.products.getAll({ page: 0, size: 8, sortBy: 'name', sortDir: 'asc' })
        ]);
        setCategories(categoriesData || []);
        setFeatured(featuredData || []);
        
        const productsList = allProductsData?.content || [];
        setBestSellers(productsList.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page content:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSubscribeNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.warning('Please enter your email address');
      return;
    }
    toast.success('Thank you for subscribing to our wellness newsletter!');
    setNewsletterEmail('');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-12 py-8">
        <div className="h-[450px] w-full glass rounded-[24px] animate-pulse shadow-sm"></div>
        <div className="space-y-4">
          <div className="h-6 bg-white/60 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="h-24 glass rounded-[24px] animate-pulse"></div>
            <div className="h-24 glass rounded-[24px] animate-pulse"></div>
            <div className="h-24 glass rounded-[24px] animate-pulse"></div>
            <div className="h-24 glass rounded-[24px] animate-pulse"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-white/60 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Skeleton variant="card" count={4} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-fadeIn text-slate-100">
      
      {/* Luxury Minimalist Hero Section */}
      <section className="relative rounded-[24px] overflow-hidden glass border border-white/10 py-16 px-8 sm:px-12 md:px-20 flex flex-col md:flex-row items-center gap-12 shadow-xl">
        <div className="flex-1 space-y-6 text-left max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-bold uppercase tracking-[0.15em]">
            <Sparkles size={11} />
            ELEVATED ESSENTIALS
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium font-serif-luxury gold-gradient-text tracking-tight leading-tight">
            Lifestyle Products
          </h1>
          <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-md">
            Discover premium skincare, beauty, and lifestyle essentials for everyday wellness. Crafted to combine everyday utility with elevated aesthetic design.
          </p>
          <div className="pt-4">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full text-xs font-extrabold tracking-[0.15em] uppercase transition duration-300 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <span>Shop Collection</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
        
        {/* Hero Display Image */}
        <div className="flex-1 w-full max-w-md aspect-[4/3] md:max-w-none rounded-[20px] overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
          <img 
            src="/hero-banner.jpg" 
            alt="Wellness Essentials"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Featured Categories section */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h2 className="text-3xl font-medium text-slate-100 tracking-tight font-serif-luxury">Shop by Category</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Explore our curated collections</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?categoryId=${cat.id}`}
              className="group glass-card border border-white/10 rounded-[24px] p-6 flex flex-col items-center gap-4 hover:border-amber-400/40 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 group-hover:scale-105 transition-all duration-300 bg-slate-900">
                <img
                  src={getCategoryImg(cat.name)}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200 group-hover:text-amber-400 transition">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium text-slate-100 tracking-tight font-serif-luxury">Featured Curations</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Handpicked skincare & objects</p>
          </div>
          <Link to="/catalog" className="text-amber-400 font-bold text-xs uppercase tracking-widest hover:text-amber-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="space-y-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-medium text-slate-100 tracking-tight font-serif-luxury">Best Sellers</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Customer favorites & repeat purchases</p>
          </div>
          <Link to="/catalog" className="text-amber-400 font-bold text-xs uppercase tracking-widest hover:text-amber-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight size={13} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white border border-gray-150 p-12 rounded-[24px] space-y-10 shadow-sm">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Our Values</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A66B]">Sustainable design principles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#F6F2EC] text-[#C9A66B] rounded-full">
              <Sparkles size={18} />
            </div>
            <h4 className="text-gray-900 font-medium text-sm font-serif-luxury">Premium Quality</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              Hand-selected high grade products sourced from ethical manufacturers.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#F6F2EC] text-[#C9A66B] rounded-full">
              <Truck size={18} />
            </div>
            <h4 className="text-gray-900 font-medium text-sm font-serif-luxury">Fast Delivery</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              Guaranteed express packing and shipment to your doorstep.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#F6F2EC] text-[#C9A66B] rounded-full">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-gray-900 font-medium text-sm font-serif-luxury">Secure Payments</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              Fully encrypted gateway supporting cards and mobile checkout options.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 flex items-center justify-center bg-[#F6F2EC] text-[#C9A66B] rounded-full">
              <RotateCcw size={18} />
            </div>
            <h4 className="text-gray-900 font-medium text-sm font-serif-luxury">Easy Returns</h4>
            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              No-questions-asked replacement or refund within 14 days of purchase.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Community Voice</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A66B]">Real stories from our shoppers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-150 p-6.5 rounded-[20px] shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-0.5">
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-sans">
              "The minimalist design of these products fits my home perfectly. Incredible quality and very responsive customer service!"
            </p>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-800 font-serif-luxury">— Sarah K.</div>
          </div>

          <div className="bg-white border border-gray-150 p-6.5 rounded-[20px] shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-0.5">
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-sans">
              "Absolutely love the organic cotton shirt. It's so soft, fits beautifully, and survives the washing machine without losing its shape."
            </p>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-800 font-serif-luxury">— Michael B.</div>
          </div>

          <div className="bg-white border border-gray-150 p-6.5 rounded-[20px] shadow-sm space-y-4">
            <div className="flex text-amber-500 gap-0.5">
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
              <Star size={13} fill="currentColor" className="border-none" />
            </div>
            <p className="text-gray-600 text-xs leading-relaxed font-sans">
              "Stunning, high-quality ceramic lamp. It gives off such a warm, comfortable light. Fast shipping and premium packaging."
            </p>
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-800 font-serif-luxury">— Emma L.</div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section */}
      <section className="bg-white border border-gray-150 rounded-[24px] p-10 md:p-16 text-center space-y-6 max-w-4xl mx-auto shadow-sm">
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-3xl font-medium text-gray-900 tracking-tight">Stay Connected</h2>
          <p className="text-xs font-bold uppercase tracking-widest text-[#C9A66B]">
            Product launches, exclusive events, and wellness tips
          </p>
        </div>

        <form onSubmit={handleSubscribeNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
          <div className="relative flex-grow">
            <Mail size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none text-gray-800 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10"
              placeholder="Your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
}
