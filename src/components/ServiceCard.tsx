'use client';

import { Clock, DollarSign, Star, Crown, CheckCircle, AlertCircle } from "lucide-react";
import { Service } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: Service;
  onSelect?: (serviceId: string) => void;
  isSelected?: boolean;
}

export function ServiceCard({ service, onSelect, isSelected = false }: ServiceCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative ${
        isSelected ? 'ring-2 ring-black' : ''
      }`}
      onClick={() => onSelect?.(service.id)}
    >
      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {service.popular && (
          <div className="bg-black text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Popular
          </div>
        )}
        {service.premium && (
          <div className="bg-nude-peach-dark text-black text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      <div className="h-56 bg-nude-peach flex items-center justify-center relative group">
        <div className="text-7xl group-hover:scale-110 transition-transform duration-500">💇‍♀️</div>
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-8">
        <div className="mb-4">
          <h3 className="text-2xl font-serif font-bold text-black mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{service.description}</p>
        </div>
        
        {/* Features/Included */}
        {service.includes && service.includes.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {service.includes.slice(0, 3).map((item, index) => (
                <span key={index} className="text-[11px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100">
                  {item}
                </span>
              ))}
              {service.includes.length > 3 && (
                <span className="text-[11px] text-gray-400 font-medium self-center">+{service.includes.length - 3} more</span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
              <Clock className="w-4 h-4" />
              {formatDuration(service.duration)}
            </div>
            <div className="flex items-center gap-0.5 text-xl font-bold text-black">
              <span className="text-sm font-normal text-gray-400 mr-0.5">$</span>
              {service.price}
            </div>
          </div>
          
          <motion.div 
            whileTap={{ scale: 0.9 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isSelected ? 'bg-black text-white' : 'bg-nude-peach text-black hover:bg-black hover:text-white'
            }`}
          >
            {isSelected ? <CheckCircle className="w-6 h-6" /> : <ChevronRight className="w-5 h-5" />}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
    </svg>
  );
}
