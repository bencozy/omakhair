import Link from "next/link";
import { Calendar, Clock, Star, Phone, Mail, MapPin } from "lucide-react";
import { ServiceCard } from "@/components/ServiceCard";
import { getServices } from "@/lib/utils";

export default function Home() {
  const services = getServices();
  const featuredServices = services.slice(0, 3);

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
            <Link
              href="/book"
              className="bg-rose-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-rose-700 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Book Now</span>
              <span className="sm:hidden">Book</span>
            </Link>
          </div>
        </div>
      </header>

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

      {/* Contact Info */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-700">Ready to book or have questions? We&apos;re here to help!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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