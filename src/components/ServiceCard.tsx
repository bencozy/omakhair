'use client';

import { Clock, DollarSign, Star, Crown, CheckCircle, AlertCircle } from "lucide-react";
import { Service } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  onSelect?: (serviceId: string) => void;
  isSelected?: boolean;
}

export function ServiceCard({ service, onSelect, isSelected = false }: ServiceCardProps) {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative ${
        isSelected ? 'ring-2 ring-rose-500 transform scale-105' : 'hover:transform hover:scale-102'
      }`}
      onClick={() => onSelect?.(service.id)}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {service.popular && (
          <div className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            Popular
          </div>
        )}
        {service.premium && (
          <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Premium
          </div>
        )}
      </div>

      <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center relative">
        <div className="text-6xl">💇‍♀️</div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{service.description}</p>
        
        {/* What's Included */}
        {service.includes && service.includes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              What&apos;s Included
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {service.includes.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-rose-400 rounded-full"></div>
                  {item}
                </li>
              ))}
              {service.includes.length > 3 && (
                <li className="text-rose-600 font-medium">+{service.includes.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {service.requirements && service.requirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Please Note
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {service.requirements.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {formatDuration(service.duration)}
            </div>
            <div className="flex items-center gap-1 text-lg font-bold text-rose-600">
              <DollarSign className="w-5 h-5" />
              {formatCurrency(service.price)}
            </div>
          </div>
          {isSelected && (
            <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
