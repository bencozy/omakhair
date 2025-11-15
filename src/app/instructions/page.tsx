'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertCircle, Phone, Mail } from 'lucide-react';

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-50">
      {/* Fixed Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-black hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <h1 className="ml-8 text-xl font-bold text-gray-900">Instructions & Policies</h1>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">

        {/* Main Instructions Card */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
              <AlertCircle className="w-8 h-8" />
              Important Booking Instructions
            </h1>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Before Your Appointment */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-3">
                  Before Your Appointment
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Hair Preparation</h3>
                      <p className="text-gray-900">Wash and condition your hair 1-2 days before your appointment. Come with clean, detangled hair.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bring Your Extensions/Closure</h3>
                      <p className="text-gray-900">For install services, bring your own hair extensions, frontals, or closures. Quality matters for best results.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Eat Before Coming</h3>
                      <p className="text-gray-900">Services can take several hours. Please eat a meal beforehand and bring snacks if needed.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Charge Your Devices</h3>
                      <p className="text-gray-900">Bring chargers for your phone/tablet. We have WiFi available for your comfort during longer services.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Day of Appointment */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900 border-b-2 border-gray-200 pb-3">
                  Day of Your Appointment
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Arrive 10 Minutes Early</h3>
                      <p className="text-gray-900">Please arrive 10 minutes before your scheduled time for consultation and preparation.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Dress Comfortably</h3>
                      <p className="text-gray-900">Wear comfortable clothing and a shirt you can easily change out of or that you don&apos;t mind getting products on.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Bring Payment</h3>
                      <p className="text-gray-900">Payment is due at time of service. We accept cash, card, Zelle, CashApp, and Venmo.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                      <p className="text-gray-900">Let us know about any scalp sensitivities, allergies, or special requests during consultation.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Policies Section */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Booking Policies</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Cancellation Policy</h3>
                  <p className="text-gray-900">24-hour advance notice required. Same-day cancellations may incur a 50% fee.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Lateness Policy</h3>
                  <p className="text-gray-900">Late arrivals may result in shortened service time or rescheduling to accommodate other clients.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Rescheduling</h3>
                  <p className="text-gray-900">Reschedule at least 12 hours in advance. Multiple reschedules may require a deposit.</p>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Questions or Need to Reschedule?</h3>
                  <p className="text-gray-900">Contact us as soon as possible if you need to make changes to your appointment.</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-900">
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">Call/Text: (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-900">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Email: Laidbyomaa@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Book Now Button */}
            <div className="mt-8 text-center">
              <Link 
                href="/book" 
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-900 transition-colors shadow-lg"
              >
                Book Your Appointment Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
