'use client';

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Star, Menu, X } from "lucide-react";
import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ImprovedContactSection } from "@/components/ImprovedContactSection";
import { getServices } from "@/lib/utils";

export default function Home() {
  const services = getServices();
  const featuredServices = services.slice(0, 3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <Image 
                  src="/laidbyoma.png" 
                  alt="LaidbyOma" 
                  width={120} 
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/services" className="text-gray-700 hover:text-black transition-colors">
                Services
              </Link>
              <Link href="/instructions" className="text-gray-700 hover:text-black transition-colors">
                Instructions
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-black transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-black transition-colors">
                Admin
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link
                href="/book"
                className="bg-black text-white px-4 sm:px-6 py-2 rounded-full hover:bg-gray-900 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
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
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-2 space-y-1">
                <Link
                  href="/services"
                  className="block px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/instructions"
                  className="block px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Instructions
                </Link>
                <Link
                  href="#about"
                  className="block px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="#contact"
                  className="block px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Special Instructions Banner */}
      <div className="bg-black text-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-full p-2">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="font-semibold text-base tracking-tight">Important Booking Information</h3>
                <p className="text-gray-300 text-sm">Please read our special instructions before booking your appointment</p>
              </div>
            </div>
            <Link 
              href="/instructions" 
              className="bg-white text-black px-6 py-2.5 rounded-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap text-sm"
            >
              View Instructions
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-serif font-bold text-black mb-6 tracking-tight leading-tight">
            Premier Hair & Beauty
            <span className="block text-gray-800">Services</span>
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Elevate your style with our distinguished hair and beauty services. 
            From frontal installations to custom wig creation, we deliver excellence in every detail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link
              href="#services"
              className="border-2 border-black text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-black hover:text-white transition-colors text-center"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
              <p className="text-gray-700">Book appointments online with our simple booking system</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Styling</h3>
              <p className="text-gray-700">Professional hair and makeup services by experienced stylists</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Hours</h3>
              <p className="text-gray-700">Open 7 days a week with extended weekend hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-700">Professional hair and makeup services tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/book"
              className="bg-black text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              View All Services & Book
            </Link>
          </div>
        </div>
      </section>

      {/* Improved Contact Section */}
      <ImprovedContactSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-gray-400 mb-4">LaidbyOma</h3>
          <p className="text-gray-400 mb-4">Professional Hair & Makeup Services</p>
          <p className="text-gray-500 text-sm">
            © 2024 LaidbyOma. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
