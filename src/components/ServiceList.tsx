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
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  const toggleExpanded = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
  };

  const toggleDetails = (serviceId: string) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedDetails(newExpanded);
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

        const isDetailsExpanded = expandedDetails.has(service.id);
        const hasDetails = (service.includes && service.includes.length > 0) || (service.requirements && service.requirements.length > 0);

        return (
          <div 
            key={service.id}
            className={`rounded-xl transition-all duration-300 ${
              isSelected 
                ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500 shadow-lg shadow-orange-500/20' 
                : 'bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 hover:border-gray-600 hover:shadow-lg'
            }`}
          >
            {/* Main Service Row */}
            <div className="p-5">
              <div className="space-y-4">
                {/* Service Header with Selection */}
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => onServiceToggle(service.id)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 mt-1 ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-500 shadow-lg shadow-orange-500/30' 
                        : 'border-gray-600 hover:border-orange-500 hover:bg-gray-800'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-5 h-5 text-black" strokeWidth={3} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      {service.popular && (
                        <div className="bg-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-black" />
                          Popular
                        </div>
                      )}
                      {service.premium && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                          <Crown className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-3 leading-relaxed">{service.description}</p>
                    
                    {/* View More Button */}
                    {hasDetails && (
                      <button
                        onClick={() => toggleDetails(service.id)}
                        className="text-xs text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-1 mb-2 transition-colors"
                      >
                        {isDetailsExpanded ? (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            View Less
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-3.5 h-3.5" />
                            View More
                          </>
                        )}
                      </button>
                    )}

                    {/* Collapsible Details Section */}
                    {hasDetails && isDetailsExpanded && (
                      <div className="space-y-3 mb-3 p-3 bg-black/30 rounded-lg border border-gray-700">
                        {/* What's Included */}
                        {service.includes && service.includes.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" />
                              What's Included:
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {service.includes.join(' • ')}
                            </p>
                          </div>
                        )}

                        {/* Requirements */}
                        {service.requirements && service.requirements.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-amber-400 mb-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Please Note:
                            </p>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {service.requirements.join(' • ')}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing and Actions Row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{formatDuration(getServiceDuration(service))}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xl font-bold text-orange-500">
                      <DollarSign className="w-5 h-5" />
                      <span>{formatCurrency(getServiceTotal(service))}</span>
                    </div>
                  </div>

                  {hasAddons && (
                    <button
                      onClick={() => toggleExpanded(service.id)}
                      className="flex items-center gap-2 text-sm text-gray-300 hover:text-white font-semibold transition-colors group"
                    >
                      <Plus className="w-4 h-4 group-hover:text-orange-500 transition-colors" />
                      <span>{isExpanded ? 'Hide Add-ons' : 'Add-ons Available'}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Add-ons Section */}
            {hasAddons && isExpanded && (
              <div className="border-t border-gray-700 bg-black/30 p-5">
                <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-orange-500" />
                  Select Add-ons
                </h4>
                <p className="text-xs text-gray-400 mb-4">Enhance your service with optional add-ons</p>
                <div className="space-y-3">
                  {service.addons?.map((addon) => {
                    const isAddonSelected = selectedAddons[service.id]?.includes(addon.id) || false;
                    
                    return (
                      <div 
                        key={addon.id}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isAddonSelected
                            ? 'border-orange-500 bg-orange-500/10 shadow-md'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onAddonToggle(service.id, addon.id)}
                            disabled={!isSelected}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                              isAddonSelected
                                ? 'border-orange-500 bg-orange-500 shadow-lg shadow-orange-500/30'
                                : isSelected
                                ? 'border-gray-600 hover:border-orange-500'
                                : 'border-gray-700 opacity-30 cursor-not-allowed'
                            }`}
                          >
                            {isAddonSelected && <CheckCircle className="w-4 h-4 text-black" strokeWidth={3} />}
                          </button>
                          
                          <div>
                            <p className="font-semibold text-white text-sm">{addon.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{addon.description}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {addon.duration > 0 && (
                            <div className="text-xs text-gray-400 mb-1 flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3" />
                              +{formatDuration(addon.duration)}
                            </div>
                          )}
                          <div className="font-bold text-orange-500 text-base">
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
