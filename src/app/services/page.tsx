'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Calendar, CheckCircle2, Award, Users, ChevronRight, Star, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Service } from '@/types';
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/ServiceCard";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (data.services) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-nude-peach">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 group text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back Home</span>
          </Link>
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif font-bold tracking-tight">
              Laid<span className="text-black">byOma</span>
            </span>
          </Link>
          <Link
            href="/book"
            className="px-8 py-3 border border-black text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            Book Now
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-32 bg-white overflow-hidden">
          <div className="absolute top-0 right-0 w-1/4 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-6 block">Our Craft</span>
              <h1 className="text-6xl lg:text-7xl font-serif font-bold mb-8">
                Signature <br />
                <span className="italic">Services.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                Elevate your beauty with our professional hair styling and installation excellence. Each service is tailored to your unique style.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {services.map((service) => (
                  <motion.div key={service.id} variants={itemVariants}>
                    <ServiceCard service={service} onSelect={() => window.location.href = '/book'} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Features/Trust */}
        {/* Features/Trust */}
        <section className="py-32 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12 text-center">
              {[
                { icon: <Award className="w-6 h-6" />, title: "Certified Expert", desc: "Professional training in all installations." },
                { icon: <Users className="w-6 h-6" />, title: "Personalized", desc: "Consultations included with every service." },
                { icon: <Clock className="w-6 h-6" />, title: "Efficient", desc: "Expert speed without compromising quality." },
                { icon: <Star className="w-6 h-6" />, title: "Premium", desc: "Only high-end products and techniques used." }
              ].map((item, i) => (
                <div key={i}>
                  <div className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center mx-auto mb-6 text-black">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-black">{item.title}</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-[0.2em]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Link href="/" className="inline-block mb-10">
            <span className="text-2xl font-serif font-bold tracking-tight">
              Laid<span className="text-black">byOma</span>
            </span>
          </Link>
          <div className="flex justify-center gap-10 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <Link href="/" className="hover:text-black">Home</Link>
            <Link href="/book" className="hover:text-black">Book Now</Link>
            <Link href="#contact" className="hover:text-black">Contact</Link>
          </div>
          <p className="mt-10 text-[10px] text-gray-400 font-bold uppercase tracking-widest">© 2024 LaidbyOma. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
