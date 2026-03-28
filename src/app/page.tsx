'use client';

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star, Menu, X, Users, Award, TrendingUp, Heart, Sparkles, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ImprovedContactSection } from "@/components/ImprovedContactSection";
import { Service } from "@/types";

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

  const featuredServices = services.slice(0, 6);

  const testimonials = [
    {
      name: "Chioma Adebayo",
      rating: 5,
      text: "LaidbyOma transformed my look completely! The braiding work is absolutely stunning and lasted for weeks. Professional, clean, and such a welcoming atmosphere.",
      service: "Knotless Braids",
      avatar: "/avatar1.png"
    },
    {
      name: "Amara Okafor",
      rating: 5,
      text: "Best frontal installation I've ever had! The attention to detail is incredible. My hair looks so natural and I've received countless compliments. Highly recommend!",
      service: "Frontal Installation",
      avatar: "/avatar2.png"
    },
    {
      name: "Ama Mensah",
      rating: 5,
      text: "The wig installation was flawless! It looks so natural and blends perfectly. LaidbyOma really knows their craft and made me feel so confident. Worth every penny!",
      service: "Wig Installation",
      avatar: "/afrobraidsideview.png"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold tracking-tight">
                  Laid<span className="text-orange-500">byOma</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors font-medium">Services</Link>
              <Link href="#gallery" className="text-gray-300 hover:text-white transition-colors font-medium">Gallery</Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">About</Link>
              <Link href="/book" className="px-6 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-sm">
                Book Appointment
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/services" className="block px-3 py-2 text-gray-300 hover:text-white">Services</Link>
              <Link href="#gallery" className="block px-3 py-2 text-gray-300 hover:text-white">Gallery</Link>
              <Link href="#about" className="block px-3 py-2 text-gray-300 hover:text-white">About</Link>
              <Link href="/book" className="block px-3 py-2 bg-white text-black rounded-lg font-semibold text-center mt-4">Book Now</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/afrobraidsideview.png"
            alt="Hair Braiding"
            fill
            className="object-cover opacity-60 scale-105 hover:scale-100 transition-transform duration-10000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Premium Hair Styling in Houston</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight tracking-tight">
              Elegance <br />
              <span className="text-orange-500 italic">Redefined.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-lg">
              Experience the art of professional braiding and hair styling. We don't just style hair; we create confidence and celebrate your beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2 group"
              >
                Book Now
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="px-10 py-4 bg-gray-900 text-white border border-gray-800 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all text-center"
              >
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-zinc-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10+</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">5.0</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">20+</div>
              <div className="text-gray-500 text-sm uppercase tracking-widest">Styles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 sm:py-32 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Our Masterpieces</h2>
              <p className="text-gray-400 text-lg max-w-xl">
                Explore our signature styles and find the perfect look for your next transformation.
              </p>
            </div>
            <Link href="/services" className="hidden sm:flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-400 transition-colors">
              See all services <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 bg-zinc-900/50 rounded-2xl animate-pulse"></div>
              ))
            ) : (
              featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))
            )}
          </div>
          
          <div className="mt-12 sm:hidden text-center">
            <Link href="/services" className="inline-flex items-center gap-2 text-orange-500 font-semibold">
              See all services <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-24 sm:py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-3xl overflow-hidden">
                <Image
                  src="/afrobraid.png"
                  alt="Stylist working"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-orange-500 p-8 rounded-2xl hidden sm:block">
                <Award className="w-12 h-12 text-white mb-4" />
                <div className="text-white font-bold text-xl leading-tight">Certified Professional <br /> Stylists</div>
              </div>
            </div>
            
            <div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-10 leading-tight">Why Choose <br />LaidbyOma?</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Heart className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personalized Care</h3>
                    <p className="text-gray-400 leading-relaxed">Every client is unique. We take the time to understand your hair goals and provide custom styling that suits your lifestyle.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Expert Techniques</h3>
                    <p className="text-gray-400 leading-relaxed">Our stylists stay updated with the latest trends and techniques to ensure you get the most modern and durable styles.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-7 h-7 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Quality Products</h3>
                    <p className="text-gray-400 leading-relaxed">We use only premium products to protect your natural hair and achieve a flawless, long-lasting finish.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32 bg-black overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Client Love</h2>
            <div className="flex justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 fill-orange-500 text-orange-500" />
              ))}
            </div>
            <p className="text-gray-400">Join our community of satisfied beautiful clients</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-8 rounded-3xl bg-zinc-900/50 border border-gray-800 hover:border-orange-500/30 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                    <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-orange-500 text-xs font-medium uppercase tracking-wider">{testimonial.service}</div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-500 translate-y-1/2 rounded-[100%] blur-[120px] opacity-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-5xl sm:text-6xl font-serif font-bold mb-8">Ready to Shine?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Book your appointment today and let us bring out the best version of you. Your journey to beautiful hair starts here.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl font-bold text-xl hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl shadow-white/10"
          >
            Schedule Now
            <Calendar className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <ImprovedContactSection />

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-2xl font-bold mb-6">
            Laid<span className="text-orange-500">byOma</span>
          </div>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} LaidbyOma. All rights reserved. Professional Hair Styling in Houston, TX.
          </p>
        </div>
      </footer>
    </div>
  );
}
