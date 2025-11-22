'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Calendar, CheckCircle, Award, Users, ChevronRight } from 'lucide-react';
import { getServices } from '@/lib/utils';

export default function ServicesPage() {
  const services = getServices();

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
              Our Services
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 mb-12 leading-relaxed">
              Professional hair services tailored to enhance your natural beauty. 
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
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category: Braiding Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-full mb-4">
                BRAIDING
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Braiding Services
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Expert braiding techniques for protective styling and beautiful looks
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Braids')
                .map((service, index) => (
                  <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                    <div className="p-8">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-3xl font-bold text-orange-500">${service.price}</span>
                        <Link 
                          href="/book"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors group/link"
                        >
                          Book Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Category: Installation & Styling */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-full mb-4">
                INSTALLATION
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Installation & Styling
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional installations for a natural, seamless look
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Installation')
                .map((service, index) => (
                  <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                    <div className="p-8">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-3xl font-bold text-orange-500">${service.price}</span>
                        <Link 
                          href="/book"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors group/link"
                        >
                          Book Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Category: Wig Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-full mb-4">
                WIG SERVICES
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Wig Services
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional wig installation and styling services
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'Wigs')
                .map((service, index) => (
                  <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                    <div className="p-8">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-3xl font-bold text-orange-500">${service.price}</span>
                        <Link 
                          href="/book"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors group/link"
                        >
                          Book Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Category: Sew-In Services */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-orange-500 text-black text-sm font-semibold rounded-full mb-4">
                SEW-IN
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Sew-In Services
              </h3>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional sew-in installations for versatile styling
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter(s => s.category === 'sew-in')
                .map((service, index) => (
                  <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                    <div className="p-8">
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-orange-500 text-black text-xs font-bold rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{service.name}</h3>
                      <p className="text-gray-400 text-sm mb-6 leading-relaxed">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                        <span className="text-3xl font-bold text-orange-500">${service.price}</span>
                        <Link 
                          href="/book"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors group/link"
                        >
                          Book Now <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="border-t border-gray-800 py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Why Choose LaidbyOma?
            </h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experience the difference with our commitment to excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-black" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Expert Craftsmanship</h4>
              <p className="text-gray-400 leading-relaxed">
                Years of experience delivering beautiful, long-lasting styles with attention to detail.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7 text-black" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Premium Products</h4>
              <p className="text-gray-400 leading-relaxed">
                We use only high-quality, professional-grade products to ensure the best results.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-black" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Flexible Scheduling</h4>
              <p className="text-gray-400 leading-relaxed">
                Convenient online booking with flexible appointment times to fit your schedule.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-700 hover:border-orange-500 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-black" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Customer Satisfaction</h4>
              <p className="text-gray-400 leading-relaxed">
                Your satisfaction is our priority. We ensure you leave feeling confident and beautiful.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 border-t border-gray-800 bg-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Book Your Appointment?
          </h3>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Choose your service and schedule online in just a few clicks. We can't wait to help you look and feel amazing!
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 hover:scale-105 transition-all shadow-2xl"
          >
            <Calendar className="w-6 h-6" />
            Book Your Appointment Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Laid<span className="text-orange-500">byOma</span>
            </h3>
            <p className="text-gray-400 mb-4">Premier Hair Services</p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LaidbyOma. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

