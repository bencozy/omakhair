'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Calendar, CheckCircle, Award, Users, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Service } from '@/types';

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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                Laid<span className="text-orange-500">byOma</span>
              </span>
            </Link>
            <Link
              href="/book"
              className="px-6 py-2.5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-sm"
            >
              Book Now
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 sm:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight">
              Our <span className="text-orange-500 italic">Signature</span> Services
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto">
              Professional hair styling and braiding excellence. Each service is tailored to enhance your natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-zinc-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-500 text-sm">Expertly crafted styles using only the best techniques and products.</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Expert Stylists</h3>
              <p className="text-gray-500 text-sm">Dedicated professionals committed to bringing your hair goals to life.</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="text-lg font-bold mb-2">Efficient Service</h3>
              <p className="text-gray-500 text-sm">Respecting your time while never compromising on attention to detail.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-24 sm:py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse"></div>
              ))
            ) : (
              services.map((service) => (
                <div 
                  key={service.id} 
                  className="group relative bg-zinc-900/40 rounded-3xl p-8 border border-gray-800/60 hover:border-orange-500/30 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-orange-500 transition-colors">{service.name}</h3>
                    {service.popular && (
                      <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">Popular</span>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-8 flex-grow leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{service.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-2 text-white font-bold text-lg">
                        <DollarSign className="w-4 h-4 text-orange-500" />
                        <span>{service.price}</span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/book?service=${service.id}`}
                      className="block w-full text-center py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-orange-500 hover:text-white transition-all transform group-hover:scale-[1.02]"
                    >
                      Book This Service
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900/30 border-t border-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold mb-8">Elevate Your Look Today</h2>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-10 py-4 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-all transform hover:scale-105 shadow-xl shadow-orange-500/20"
          >
            Schedule Appointment
            <Calendar className="w-5 h-5" />
          </Link>
          <p className="mt-12 text-gray-500 text-sm">
            © {new Date().getFullYear()} LaidbyOma. Professional excellence in every stitch.
          </p>
        </div>
      </footer>
    </div>
  );
}
