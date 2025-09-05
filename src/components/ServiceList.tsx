'use client';

import { useState } from 'react';
import { Clock, DollarSign, Star, Crown, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import { Service, ServiceAddon } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/utils";

interface ServiceListProps {
  services: Service[];
  selectedServices: string[];
  selectedAddons: { [serviceId: string]: string[] };
  onServiceToggle: (serviceId: string) => void;
  onAddonToggle: (serviceId: string, addonId: string) => void;
}

export function ServiceList({ 
  services, 
  selectedServices, 
  selectedAddons, 
  onServiceToggle, 
  onAddonToggle 
}: ServiceListProps) {
  const [expandedServices, setExpandedServices] = useState<Set<string>>(new Set());

  const toggleExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const getServiceTotal = (service: Service) => {
    const serviceAddons = selectedAddons[service.id] || [];
    const addonTotal = serviceAddons.reduce((total, addonId) => {
      const addon = service.addons?.find(a => a.id === addonId);
      return total + (addon?.price || 0);
    }, 0);
    return service.price + addonTotal;
  };

  const getServiceDuration = (service: Service) => {
    const serviceAddons = selectedAddons[service.id] || [];
    const addonDuration = serviceAddons.reduce((total, addonId) => {
      const addon = service.addons?.find(a => a.id === addonId);
      return total + (addon?.duration || 0);
    }, 0);
    return service.duration + addonDuration;
  };

  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.id);
        const isExpanded = expandedServices.has(service.id);
        const hasAddons = service.addons && service.addons.length > 0;

        return (
          <div 
            key={service.id}
            className={`border rounded-lg transition-all duration-200 ${
              isSelected 
                ? 'border-rose-500 bg-rose-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            {/* Main Service Row */}
            <div className="p-4">
              <div className="space-y-4">
                {/* Service Header with Selection */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onServiceToggle(service.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-1 ${
                      isSelected 
                        ? 'border-rose-500 bg-rose-500' 
                        : 'border-gray-300 hover:border-rose-400'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      {service.popular && (
                        <div className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </div>
                      )}
                      {service.premium && (
                        <div className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    
                    {/* What's Included */}
                    {service.includes && service.includes.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          What's Included:
                        </p>
                        <p className="text-xs text-gray-600">
                          {service.includes.join(' • ')}
                        </p>
                      </div>
                    )}

                    {/* Requirements */}
                    {service.requirements && service.requirements.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-amber-700 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Please Note:
                        </p>
                        <p className="text-xs text-gray-600">
                          {service.requirements.join(' • ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing and Actions Row */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {formatDuration(getServiceDuration(service))}
                    </div>
                    <div className="flex items-center gap-1 text-lg font-bold text-rose-600">
                      <DollarSign className="w-5 h-5" />
                      {formatCurrency(getServiceTotal(service))}
                    </div>
                  </div>

                  {hasAddons && (
                    <button
                      onClick={() => toggleExpanded(service.id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            {hasAddons && isExpanded && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add-ons & Upgrades
                </h4>
                <div className="space-y-3">
                  {service.addons?.map((addon) => {
                    const isAddonSelected = selectedAddons[service.id]?.includes(addon.id) || false;
                    
                    return (
                      <div 
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isAddonSelected
                            ? 'border-rose-300 bg-rose-100'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onAddonToggle(service.id, addon.id)}
                            disabled={!isSelected}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isAddonSelected
                                ? 'border-rose-500 bg-rose-500'
                                : isSelected
                                ? 'border-gray-300 hover:border-rose-400'
                                : 'border-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            {isAddonSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </button>
                          
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{addon.name}</p>
                            <p className="text-xs text-gray-600">{addon.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {addon.duration > 0 && (
                            <div className="text-xs text-gray-500 mb-1">
                              +{formatDuration(addon.duration)}
                            </div>
                          )}
                          <div className="font-semibold text-rose-600">
                            +{formatCurrency(addon.price)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
