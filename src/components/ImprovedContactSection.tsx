'use client';

import Link from "next/link";
import { Calendar, Phone, Mail, MapPin } from "lucide-react";
import { SimpleQRCode } from "./SimpleQRCode";

export function ImprovedContactSection() {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-xl text-gray-600">Ready to book or have questions? We&apos;re here to help!</p>
        </div>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column - Contact Information */}
          <div className="text-center lg:text-left">
            <div className="grid grid-cols-1 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                </div>
                <a href="tel:+15551234567" className="text-gray-600 hover:text-gray-700 transition-colors">
                  (555) 123-4567
                </a>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Email</h4>
                </div>
                <a href="mailto:Laidbyomaa@gmail.com" className="text-gray-600 hover:text-gray-700 transition-colors">
                  Laidbyomaa@gmail.com
                </a>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-900">Location</h4>
                </div>
                <p className="text-gray-700">123 Beauty Ave, Style City</p>
              </div>
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                href="/book"
                className="bg-gray-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Your Appointment
              </Link>
            </div>
          </div>

          {/* Right Column - QR Code */}
          <div className="flex justify-center">
            <div className="text-center">
              <SimpleQRCode />
              <p className="text-sm text-gray-600 mt-4">
                Scan to save our contact info
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
