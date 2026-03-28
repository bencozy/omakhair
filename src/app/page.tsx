'use client';

import Link from "next/link";
import { Calendar, Clock, Star, Menu, X, ArrowRight, CheckCircle2, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ImprovedContactSection } from "@/components/ImprovedContactSection";
import { Service } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const featuredServices = services.slice(0, 3);

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
            <Link href="/gallery" className="text-sm font-medium hover:text-nude-peach-dark transition-colors uppercase tracking-widest">Gallery</Link>
            <Link href="#about" className="text-sm font-medium hover:text-nude-peach-dark transition-colors uppercase tracking-widest">About</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-nude-peach-dark transition-colors uppercase tracking-widest">Contact</Link>
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
                <Link href="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Gallery</Link>
                <Link href="#about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">About</Link>
                <Link href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Contact</Link>
                <Link href="/book" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-black text-white text-center rounded-xl font-bold">
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-gray-200 text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
                <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
                Now Booking for Summer
              </div>
              <h1 className="text-7xl lg:text-8xl font-serif font-bold leading-[0.9] mb-8">
                Crafting <br />
                <span className="italic">Beautiful</span> <br />
                Moments.
              </h1>
              <p className="text-xl text-gray-700 mb-12 max-w-lg leading-relaxed">
                Elevate your style with our signature hair services. Specialized in professional installations and braiding with a focus on natural elegance.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/book" className="group px-10 py-5 border-2 border-black text-black rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black hover:text-white transition-all duration-300">
                  Secure Your Spot
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/services" className="px-10 py-5 border border-black rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                  View Services
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <div className="absolute inset-0 bg-nude-peach flex items-center justify-center">
                  <span className="text-9xl">✨</span>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-nude-peach-dark rounded-full blur-3xl opacity-50 -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-nude-peach rounded-full blur-3xl opacity-50 -z-10" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-16">
              {[
                { title: "Expert Styling", desc: "Decades of combined experience in high-end hair care." },
                { title: "Premium Products", desc: "Only the finest materials for a lasting, natural look." },
                { title: "Personalized Care", desc: "Every service is tailored to your unique beauty." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-xl font-serif font-bold mb-4">{feature.title}</h3>
                  <div className="w-10 h-[1px] bg-black mb-6" />
                  <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Services */}
        <section className="py-32 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Our Expertise</span>
                <h2 className="text-5xl lg:text-6xl font-serif font-bold">Signature <br /> <span className="italic">Services.</span></h2>
              </div>
              <Link href="/services" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:border-nude-peach-dark hover:text-nude-peach-dark transition-all">
                View All Services
              </Link>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-8"
              >
                {featuredServices.map((service) => (
                  <motion.div key={service.id} variants={itemVariants}>
                    <ServiceCard service={service} onSelect={() => window.location.href = '/book'} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-32 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-nude-peach rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl">👸</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-2xl shadow-xl max-w-xs">
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-nude-peach-dark text-nude-peach-dark" />)}
                </div>
                <p className="text-sm font-medium italic">"The most professional installation I've ever had. My hair feels and looks amazing!"</p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">The Experience</span>
              <h2 className="text-5xl font-serif font-bold mb-10 leading-tight">Elevating Beauty Through <span className="italic">Expertise.</span></h2>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                At LaidbyOma, we believe that every appointment is an opportunity to boost your confidence. Our meticulous approach to hair care ensures that you leave our chair feeling like the best version of yourself.
              </p>
              <ul className="space-y-6 mb-12">
                {["Professional Consultations", "Luxury Styling Environment", "Premium Hair Maintenance"].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full bg-nude-peach flex items-center justify-center group-hover:bg-black transition-colors">
                      <CheckCircle2 className="w-4 h-4 text-black group-hover:text-white" />
                    </div>
                    <span className="font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/book" className="inline-block px-10 py-5 border-2 border-black text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all">
                Book Your Session
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-4 block">Voices of Beauty</span>
              <h2 className="text-5xl font-serif font-bold italic">Kind Words.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                { name: "Chioma Adebayo", text: "LaidbyOma transformed my look completely! The braiding work is absolutely stunning and lasted for weeks." },
                { name: "Amara Okafor", text: "Best frontal installation I've ever had! The attention to detail is incredible. My hair looks so natural." },
                { name: "Ama Mensah", text: "The wig installation was flawless! It looks so natural and blends perfectly. Worth every penny!" }
              ].map((testi, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-nude-peach-dark text-nude-peach-dark" />)}
                  </div>
                  <p className="text-gray-600 mb-8 italic leading-relaxed">"{testi.text}"</p>
                  <div className="font-bold uppercase tracking-widest text-[10px]">{testi.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <div id="contact" className="py-32 bg-white">
          <ImprovedContactSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white text-black py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <Link href="/" className="inline-block mb-8">
                <span className="text-3xl font-serif font-bold tracking-tight">
                  Laid<span className="text-black">byOma</span>
                </span>
              </Link>
              <p className="text-gray-500 max-w-sm leading-relaxed mb-8">
                Professional hair styling and braiding excellence. Redefining beauty one appointment at a time.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Quick Links</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><Link href="/services" className="hover:text-black transition-colors">Services</Link></li>
                <li><Link href="/gallery" className="hover:text-black transition-colors">Gallery</Link></li>
                <li><Link href="#about" className="hover:text-black transition-colors">About</Link></li>
                <li><Link href="/book" className="hover:text-black transition-colors">Book Now</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Contact</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="flex items-center gap-3"><Mail className="w-4 h-4" /> Laidbyomaa@gmail.com</li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4" /> Style City, USA</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <p>© 2024 LaidbyOma. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-black">Privacy Policy</Link>
              <Link href="#" className="hover:text-black">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
