'use client';

import { useState } from 'react';
import { Clock, Star, Crown, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import { Service, ServiceAddon } from "@/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  const toggleDetails = (serviceId: string) => {
    const newExpanded = new Set(expandedDetails);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedDetails(newExpanded);
  };

  return (
    <div className="space-y-6">
      {services.map((service) => {
        const isSelected = selectedServices.includes(service.id);
        const hasAddons = service.addons && service.addons.length > 0;
        const isDetailsExpanded = expandedDetails.has(service.id);

        return (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group rounded-2xl transition-all duration-300 overflow-hidden border ${
              isSelected 
                ? 'bg-nude-peach/30 border-black shadow-lg shadow-black/5' 
                : 'bg-white border-gray-100 hover:border-nude-peach-dark'
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onServiceToggle(service.id)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-serif font-bold text-black">{service.name}</h3>
                    {service.popular && (
                      <span className="text-[9px] font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <Clock className="w-4 h-4" />
                      {formatDuration(service.duration)}
                    </div>
                    <div className="flex items-center gap-1.5 text-lg font-bold text-black">
                      <span className="text-xs font-normal text-gray-400">$</span>
                      {service.price}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onServiceToggle(service.id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isSelected ? 'bg-black text-white' : 'bg-nude-peach text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {isSelected ? <CheckCircle className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  </motion.button>
                  <button 
                    onClick={() => toggleDetails(service.id)}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
                  >
                    {isDetailsExpanded ? 'Less Info' : 'More Info'}
                  </button>
                </div>
              </div>

              {/* Details & Addons */}
              <AnimatePresence>
                {(isDetailsExpanded || isSelected) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-8 space-y-8 border-t border-gray-100 mt-8">
                      {/* What's Included */}
                      {service.includes && service.includes.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-nude-peach-dark" />
                            What&apos;s Included
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {service.includes.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 text-xs text-gray-500">
                                <div className="w-1 h-1 bg-nude-peach-dark rounded-full" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Addons */}
                      {hasAddons && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-nude-peach-dark" />
                            Enhance Your Service
                          </h4>
                          <div className="space-y-3">
                            {service.addons?.map((addon) => {
                              const isAddonSelected = selectedAddons[service.id]?.includes(addon.id);
                              return (
                                <div 
                                  key={addon.id}
                                  onClick={() => isSelected && onAddonToggle(service.id, addon.id)}
                                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isSelected 
                                      ? 'cursor-pointer hover:border-nude-peach-dark' 
                                      : 'opacity-50 grayscale'
                                  } ${isAddonSelected ? 'bg-white border-black' : 'bg-gray-50/50 border-gray-100'}`}
                                >
                                  <div>
                                    <div className="text-sm font-bold text-black">{addon.name}</div>
                                    <div className="flex gap-4 mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                      <span>+{formatDuration(addon.duration)}</span>
                                      <span>+${addon.price}</span>
                                    </div>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                    isAddonSelected ? 'bg-black border-black text-white' : 'border-gray-200 bg-white'
                                  }`}>
                                    {isAddonSelected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-3 h-3" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
