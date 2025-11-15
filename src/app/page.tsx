'use client';

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star, Menu, X, Users, Award, TrendingUp, Heart, Sparkles, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ImprovedContactSection } from "@/components/ImprovedContactSection";
import { getServices } from "@/lib/utils";

export default function Home() {
  const services = getServices();
  const featuredServices = services.slice(0, 6);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "LaidbyOma transformed my look completely! The braiding work is absolutely stunning and lasted for weeks. Professional, clean, and such a welcoming atmosphere.",
      service: "Knotless Braids"
    },
    {
      name: "Maya Thompson",
      rating: 5,
      text: "Best frontal installation I've ever had! The attention to detail is incredible. My hair looks so natural and I've received countless compliments. Highly recommend!",
      service: "Frontal Installation"
    },
    {
      name: "Jessica Williams",
      rating: 5,
      text: "The custom wig made for me is perfection! It fits like a dream and the quality is outstanding. LaidbyOma really knows their craft. Worth every penny!",
      service: "Custom Wig Making"
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
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                Home
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors font-medium">
                About Us
              </Link>
              <Link href="/services" className="text-gray-300 hover:text-white transition-colors font-medium">
                Services
              </Link>
              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors font-medium">
                Gallery
              </Link>
              <Link href="/instructions" className="text-gray-300 hover:text-white transition-colors font-medium">
                Pricing
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link
                href="/book"
                className="bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-sm sm:text-base"
              >
                Book Now
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-800 bg-black/95">
              <div className="px-4 py-2 space-y-1">
                <Link
                  href="/"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#about"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#testimonials"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  href="/instructions"
                  className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Where Beauty
              <br />
              Meets <span className="text-orange-500">Confidence</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-xl leading-relaxed">
              Discover luxury hair & beauty services designed to bring out your natural glow. 
              From exquisite braiding to custom wig creations, we deliver artistry in every style.
            </p>
            <Link
              href="/book"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              Book Now
            </Link>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden border border-gray-800">
              <Image
                src="/afrobraidfrontal.png"
                alt="Beautiful hair styling at LaidbyOma"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 bg-black/80 backdrop-blur-md rounded-2xl p-3 lg:p-4 border border-gray-700">
                <div className="flex -space-x-2 mb-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 border-2 border-black"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 border-2 border-black"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 border-2 border-black"></div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-black"></div>
                </div>
                <p className="text-xs lg:text-sm text-gray-300">Authentic reviews from<br />clients who trust us</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              More Than a Salon,
              <br />
              <span className="text-white">An Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              At LaidbyOma, we believe beauty is more than just a look—it's a feeling. 
              Our mission is to create a transformative experience that leaves you confident and radiant.
            </p>
            <Link href="#services" className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Read More
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">500+</div>
              <p className="text-gray-400">At LaidbyOma, we believe beauty is more than just a look—it's a feeling.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">24</div>
              <p className="text-gray-400">Expert stylists dedicated to your beauty transformation</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">20k+</div>
              <p className="text-gray-400">Beautiful styles created with passion and precision</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">15+</div>
              <p className="text-gray-400">Years of excellence in hair and beauty artistry</p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Services */}
      <section id="services" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Signature Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => {
              // Map images to services based on category
              const getServiceImage = () => {
                const lowerName = service.name.toLowerCase();
                const lowerCategory = service.category.toLowerCase();
                
                if (lowerCategory.includes('wig') || lowerName.includes('wig')) {
                  return '/wigfrontal.png';
                } else if (lowerName.includes('knotless') || lowerName.includes('box braid')) {
                  return '/afrobraidfrontal.png';
                } else if (lowerCategory.includes('braid') || lowerName.includes('braid')) {
                  return index % 2 === 0 ? '/europebraidfrontal.png' : '/afrobraidsideview.png';
                } else if (lowerName.includes('frontal') || lowerName.includes('closure')) {
                  return '/europebraidesideview.png';
                }
                return '/afrobraidfrontal.png'; // default
              };

              return (
                <div key={service.id} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-orange-500 transition-all duration-300">
                  <div className="h-80 relative overflow-hidden">
                    <Image
                      src={getServiceImage()}
                      alt={service.name}
                      fill
                      className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block px-3 py-1 bg-orange-500 text-black text-xs font-bold rounded-full mb-2">
                        {service.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition-colors">{service.name}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-500">${service.price}</span>
                      <Link 
                        href="/book"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        Get Started <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all hover:scale-105"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">
              Hear from the
              <br />
              LaidbyOma Family
            </h2>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors flex items-center justify-center">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full bg-white text-black hover:bg-gray-100 transition-colors flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 hover:border-orange-500 transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400"></div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Look?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Book your appointment today and experience the LaidbyOma difference. 
            Our expert stylists are ready to bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-all hover:scale-105"
            >
              Book Appointment
            </Link>
            <Link
              href="/instructions"
              className="bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all border border-gray-700"
            >
              View Instructions
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Laid<span className="text-orange-500">byOma</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Premier hair & beauty services designed to bring out your natural confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Services</Link></li>
                <li><Link href="/book" className="hover:text-white transition-colors">Book Now</Link></li>
                <li><Link href="/instructions" className="hover:text-white transition-colors">Instructions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/services" className="hover:text-white transition-colors">Braiding</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Wig Installation</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Custom Wigs</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">Hair Care</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Email: laidbyoma@gmail.com.com</li>
                <li>Phone: (945) 358-9088</li>
                <li>Open 5 days a week</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 LaidbyOma. All rights reserved. | Crafted with ❤️ for beauty excellence</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
