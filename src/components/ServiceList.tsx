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
            className={`border rounded-lg transition-all duration-200 ${
              isSelected 
                ? 'border-gray-500 bg-gray-50' 
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
                        ? 'border-gray-500 bg-gray-500' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      {service.popular && (
                        <div className="bg-black text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-1">
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
                    <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                    
                    {/* View More Button */}
                    {hasDetails && (
                      <button
                        onClick={() => toggleDetails(service.id)}
                        className="text-xs text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1 mb-2"
                      >
                        {isDetailsExpanded ? (
                          <>
                            <ChevronDown className="w-3 h-3" />
                            View Less
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-3 h-3" />
                            View More
                          </>
                        )}
                      </button>
                    )}

                    {/* Collapsible Details Section */}
                    {hasDetails && isDetailsExpanded && (
                      <div className="space-y-3 mb-3">
                        {/* What's Included */}
                        {service.includes && service.includes.length > 0 && (
                          <div>
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
                          <div>
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
                    <div className="flex items-center gap-1 text-lg font-bold text-gray-600">
                      <DollarSign className="w-5 h-5" />
                      {formatCurrency(getServiceTotal(service))}
                    </div>
                  </div>

                  {hasAddons && (
                    <button
                      onClick={() => toggleExpanded(service.id)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      {isExpanded ? 'Hide Add-ons' : 'Add-ons Available'}
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
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Select Add-ons
                </h4>
                <p className="text-xs text-gray-600 mb-3">Choose optional add-ons to enhance your service</p>
                <div className="space-y-3">
                  {service.addons?.map((addon) => {
                    const isAddonSelected = selectedAddons[service.id]?.includes(addon.id) || false;
                    
                    return (
                      <div 
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          isAddonSelected
                            ? 'border-gray-300 bg-gray-100'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => onAddonToggle(service.id, addon.id)}
                            disabled={!isSelected}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isAddonSelected
                                ? 'border-gray-500 bg-gray-500'
                                : isSelected
                                ? 'border-gray-300 hover:border-gray-400'
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
                          <div className="font-semibold text-gray-600">
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
