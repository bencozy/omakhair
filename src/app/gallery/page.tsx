'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ArrowLeft, 
  Filter, 
  Calendar, 
  ExternalLink,
  Instagram
} from 'lucide-react';

interface GalleryItem {
  _id: string;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  associatedServiceId?: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [galleryRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/gallery/categories`)
        ]);

        if (galleryRes.ok) {
          const data = await galleryRes.json();
          setItems(data);
        }

        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(['All', ...data]);
        }
      } catch (error) {
        console.error('Error fetching gallery data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-nude-peach selection:text-black">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-serif font-bold tracking-tight">
              Laid<span className="text-black transition-colors duration-300">byOma</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            <Link href="/services" className="text-sm font-medium hover:text-nude-peach-dark transition-colors uppercase tracking-widest">Services</Link>
            <Link href="/gallery" className="text-sm font-bold text-nude-peach-dark transition-colors uppercase tracking-widest">Gallery</Link>
            <Link href="/book" className="px-8 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black hover:text-white transition-all duration-300 active:scale-95">
              Book Now
            </Link>
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col space-y-6">
                <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Services</Link>
                <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Gallery</Link>
                <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-black text-white text-center rounded-xl font-bold">
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="mb-16 text-center max-w-3xl mx-auto">
            <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-6 transition-colors">
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Home
            </Link>
            <h1 className="text-5xl font-serif font-bold italic mb-6">Style Gallery.</h1>
            <p className="text-gray-500 text-lg leading-relaxed">
              Explore our portfolio of curated hair styles. From professional frontal installations to intricate braids, find the perfect look for your next appointment.
            </p>
          </header>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-black text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-gray-100 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    layout
                    key={item._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="aspect-[4/5] relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-nude-peach mb-2 block">
                            {item.category}
                          </span>
                          <h3 className="text-2xl font-serif font-bold italic text-white mb-2">{item.title}</h3>
                          <p className="text-gray-300 text-sm mb-6 line-clamp-2">{item.description}</p>
                          
                          <Link 
                            href={item.associatedServiceId ? `/book?service=${item.associatedServiceId}` : '/book'}
                            className="inline-flex items-center px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-nude-peach transition-colors"
                          >
                            Book This Style <ChevronRight className="w-3 h-3 ml-2" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">No styles found</h3>
              <p className="text-gray-500">We haven't added any photos for this category yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-black py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <Link href="/" className="inline-block mb-8">
              <span className="text-3xl font-serif font-bold tracking-tight">
                Laid<span className="text-black">byOma</span>
              </span>
            </Link>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed mb-12">
              Follow our journey and see more work on social media.
            </p>
            <div className="flex justify-center gap-6">
              <a href="#" className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                <Calendar className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
