'use client';

import Link from "next/link";
import { Calendar, Clock, Star, Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { useState } from "react";
import { ServiceCard } from "@/components/ServiceCard";
import { ImprovedContactSection } from "@/components/ImprovedContactSection";
import { getServices } from "@/lib/utils";

export default function Home() {
  const services = getServices();
  const featuredServices = services.slice(0, 3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-rose-600">Oma Khair</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/instructions" className="text-gray-700 hover:text-rose-600 transition-colors">
                Instructions
              </Link>
              <Link href="#services" className="text-gray-700 hover:text-rose-600 transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-rose-600 transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors">
                Contact
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-rose-600 transition-colors">
                Admin
              </Link>
            </nav>
            
            <div className="flex items-center gap-4">
              <Link
                href="/book"
                className="bg-rose-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-rose-700 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </Link>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-rose-600 hover:bg-gray-100 transition-colors"
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
                  href="/instructions"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Instructions
                </Link>
                <Link
                  href="#services"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#about"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="#contact"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  href="/admin"
                  className="block px-3 py-2 text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
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
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-2">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Important Booking Information</h3>
                <p className="text-rose-100 text-sm">Please read our special instructions before booking your appointment</p>
              </div>
            </div>
            <Link 
              href="/instructions" 
              className="bg-white text-rose-600 px-6 py-3 rounded-full font-semibold hover:bg-rose-50 transition-colors whitespace-nowrap"
            >
              View Instructions
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Beautiful Hair & Makeup
            <span className="block text-rose-600">Artistry</span>
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Transform your look with our professional hair and makeup services. 
            From frontal installations to custom wig making, we bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-rose-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link
              href="#services"
              className="border-2 border-rose-600 text-rose-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-rose-600 hover:text-white transition-colors text-center"
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
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Scheduling</h3>
              <p className="text-gray-700">Book appointments online with our simple booking system</p>
            </div>
            <div className="text-center">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Styling</h3>
              <p className="text-gray-700">Professional hair and makeup services by experienced stylists</p>
            </div>
            <div className="text-center">
              <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-rose-600" />
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
              className="bg-rose-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-rose-700 transition-colors"
            >
              View All Services & Book
            </Link>
          </div>
        </div>
      </section>


      {/* Improved Contact Section */}
      <ImprovedContactSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-700">Ready to book or have questions? We&apos;re here to help!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <Phone className="w-8 h-8 text-rose-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-700">(555) 123-4567</p>
            </div>
            <div className="text-center">
              <Mail className="w-8 h-8 text-rose-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-700">hello@omakhair.com</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-rose-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-700">123 Beauty Ave, Style City</p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Follow Us</h3>
            <div className="flex justify-center items-center gap-6 flex-wrap">
              <a 
                href="https://t.snapchat.com/Jh69xMdA" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-yellow-400 text-white px-6 py-3 rounded-full hover:bg-yellow-500 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.6-1.775 1.35-1.775.637 0 .945.479.945 1.052 0 .641-.219 1.600-.332 2.488-.188.796.4 1.445 1.184 1.445 1.421 0 2.514-1.498 2.514-3.662 0-1.915-1.377-3.254-3.342-3.254-2.276 0-3.611 1.707-3.611 3.471 0 .688.263 1.425.592 1.826.065.080.074.149.055.230-.059.252-.191.781-.218.890-.035.147-.116.178-.268.107-1.001-.465-1.624-1.926-1.624-3.1 0-2.523 1.834-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.620 0 2.757-1.739 4.976-4.151 4.976-.811 0-1.573-.421-1.834-.924l-.498 1.902c-.181.695-.669 1.566-.995 2.097A12.013 12.013 0 0 0 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
                Snapchat
              </a>
              
              <a 
                href="https://www.instagram.com/shopper_huz?igsh=MTkzNzd5bDNzd2Zncg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              
              <a 
                href="https://www.tiktok.com/@lyn_signature1?_t=ZS-8zTuebhmC9P&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Section */}
      <section className="py-12 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimpleQRCode />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold text-rose-400 mb-4">Oma Khair</h3>
          <p className="text-gray-400 mb-4">Professional Hair & Makeup Services</p>
          <p className="text-gray-500 text-sm">
            © 2024 Oma Khair. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}