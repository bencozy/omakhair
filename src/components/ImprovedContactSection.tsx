'use client';

import Link from "next/link";
import { Calendar, Phone, Mail, MapPin, Instagram, Facebook, Clock, ArrowRight } from "lucide-react";
import { SimpleQRCode } from "./SimpleQRCode";
import { motion } from "framer-motion";

export function ImprovedContactSection() {
  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/4 h-1/2 bg-nude-peach/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-nude-peach/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
          
          {/* Left Column - Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-nude-peach-dark mb-6 block">Get In Touch</span>
              <h2 className="text-5xl lg:text-6xl font-serif font-bold mb-10 leading-tight">Connect With Our <br /> <span className="italic">Expert Stylists.</span></h2>
              <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-12">
                Ready to transform your look or have specific questions about our services? Our team is dedicated to providing you with the ultimate beauty experience.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-nude-peach flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-black">Phone</h4>
                <a href="tel:+15551234567" className="text-sm font-medium text-gray-500 hover:text-nude-peach-dark transition-colors">
                  (555) 123-4567
                </a>
              </div>

              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-nude-peach flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-black">Email</h4>
                <a href="mailto:Laidbyomaa@gmail.com" className="text-sm font-medium text-gray-500 hover:text-nude-peach-dark transition-colors">
                  Laidbyomaa@gmail.com
                </a>
              </div>

              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-nude-peach flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-black">Location</h4>
                <p className="text-sm font-medium text-gray-500">123 Beauty Ave, Style City</p>
              </div>

              <div className="space-y-4 group">
                <div className="w-12 h-12 rounded-full bg-nude-peach flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <Instagram className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-black">Social</h4>
                <a href="#" className="text-sm font-medium text-gray-500 hover:text-nude-peach-dark transition-colors">
                  @LaidbyOma
                </a>
              </div>
            </div>

            <Link
              href="/book"
              className="group inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-nude-peach-dark hover:text-black transition-all duration-300"
            >
              Secure Your Appointment
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* Right Column - QR & Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-nude-peach/30 p-12 lg:p-20 rounded-3xl border border-nude-peach/50 relative z-10">
              <div className="text-center">
                <div className="inline-block p-6 bg-white rounded-3xl shadow-xl mb-10 border border-gray-100">
                  <SimpleQRCode />
                </div>
                <h3 className="text-xl font-serif font-bold mb-4 italic">Scan for Digital Card</h3>
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-12">
                  Instantly save our contact <br /> info to your device
                </p>

                <div className="pt-10 border-t border-nude-peach-dark/20 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest mb-4">
                    <Clock className="w-4 h-4" />
                    Hours of Beauty
                  </div>
                  <ul className="space-y-2 text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                    <li>Mon - Fri: 9:00 AM - 6:00 PM</li>
                    <li>Sat: 10:00 AM - 4:00 PM</li>
                    <li>Sun: Closed</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Decorative dots */}
            <div className="absolute -top-10 -right-10 w-20 h-20 grid grid-cols-4 gap-2 opacity-20">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-black rounded-full" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
