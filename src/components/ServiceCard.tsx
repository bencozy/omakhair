'use client';

import { Clock, DollarSign } from "lucide-react";
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
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        isSelected ? 'ring-2 ring-rose-500' : ''
      }`}
      onClick={() => onSelect?.(service.id)}
    >
      <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
        <div className="text-6xl">💇‍♀️</div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-700 mb-4 text-sm">{service.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {formatDuration(service.duration)}
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-rose-600">
              <DollarSign className="w-4 h-4" />
              {formatCurrency(service.price)}
            </div>
          </div>
          {isSelected && (
            <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
