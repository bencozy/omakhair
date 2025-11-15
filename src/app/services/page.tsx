'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, DollarSign, Calendar } from 'lucide-react';
import { ServiceCard } from '@/components/ServiceCard';
import { getServices } from '@/lib/utils';

export default function ServicesPage() {
  const services = getServices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-black hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link href="/">
              <Image 
                src="/laidbyoma.png" 
                alt="LaidbyOma" 
                width={120} 
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <Link
              href="/book"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm font-semibold"
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
              Our Services
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed">
              Professional hair and beauty services tailored to enhance your natural beauty. 
              Expert craftsmanship, premium products, and exceptional care.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <Clock className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white mb-1">Flexible Scheduling</div>
                <p className="text-sm text-gray-300">Book appointments at your convenience</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <DollarSign className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white mb-1">Competitive Pricing</div>
                <p className="text-sm text-gray-300">Quality services at fair prices</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all">
                <Calendar className="w-8 h-8 text-white mx-auto mb-3" />
                <div className="font-semibold text-white mb-1">Easy Online Booking</div>
                <p className="text-sm text-gray-300">Simple, secure payment process</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category: Braiding Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
                BRAIDING
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                Braiding Services
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Expert braiding techniques for protective styling and beautiful looks
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Braids')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>

          {/* Category: Installation & Styling */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
                INSTALLATION
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                Installation & Styling
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Professional installations for a natural, seamless look
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Installation')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>

          {/* Category: Wig Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
                WIG SERVICES
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                Wig Services
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Custom wig creation and professional styling services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Wigs')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>

          {/* Category: Hair Care & Color */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
                HAIR CARE
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                Hair Care & Color
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Maintain healthy hair with our care and coloring services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Hair Care' || s.category === 'Color')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>

          {/* Category: Makeup & Beauty */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-black text-white text-sm font-semibold rounded-full mb-4">
                MAKEUP
              </div>
              <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
                Makeup & Beauty
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Complete your look with professional makeup services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Makeup')
                .map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 mb-4">
              Why Choose LaidbyOma?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Expert Craftsmanship</h4>
              <p className="text-gray-600 leading-relaxed">
                Years of experience delivering beautiful, long-lasting styles with attention to detail.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Premium Products</h4>
              <p className="text-gray-600 leading-relaxed">
                We use only high-quality, professional-grade products to ensure the best results.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Flexible Scheduling</h4>
              <p className="text-gray-600 leading-relaxed">
                Convenient online booking with flexible appointment times to fit your schedule.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Customer Satisfaction</h4>
              <p className="text-gray-600 leading-relaxed">
                Your satisfaction is our priority. We ensure you leave feeling confident and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
            Ready to Book Your Appointment?
          </h3>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Choose your service and schedule online in just a few clicks. We can't wait to help you look and feel amazing!
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
          >
            <Calendar className="w-6 h-6" />
            Book Your Appointment Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} LaidbyOma. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

