'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle, DollarSign, CreditCard, Search } from 'lucide-react';
import Calendar from 'react-calendar';
import { format, addDays, startOfToday } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ServiceList } from '@/components/ServiceList';
import { PaymentForm } from '@/components/PaymentForm';
import { BookingFormData, TimeSlot, Booking, Service } from '@/types';
import { 
  generateTimeSlots, 
  calculateTotalPrice, 
  calculateTotalDuration,
  formatCurrency,
  formatDuration,
  validateEmail,
  validatePhone
} from '@/lib/utils';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedServices: [],
    selectedAddons: {},
    appointmentDate: new Date(),
    selectedTime: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingError, setBookingError] = useState<string>('');
  const [pendingBookingId, setPendingBookingId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Fetch services on mount
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (data.services) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const query = searchQuery.toLowerCase();
      const matchesService = 
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);
      
      const matchesAddons = service.addons?.some(addon => 
        addon.name.toLowerCase().includes(query) ||
        addon.description.toLowerCase().includes(query)
      ) || false;
      
      return matchesService || matchesAddons;
    });
  }, [services, searchQuery]);

  const selectedServices = useMemo(() => {
    return services.filter(service => formData.selectedServices.includes(service.id));
  }, [services, formData.selectedServices]);

  const totalPrice = useMemo(() => {
    return calculateTotalPrice(formData.selectedServices, formData.selectedAddons, services);
  }, [formData.selectedServices, formData.selectedAddons, services]);

  const totalDuration = useMemo(() => {
    return calculateTotalDuration(formData.selectedServices, formData.selectedAddons, services);
  }, [formData.selectedServices, formData.selectedAddons, services]);

  // Load state from URL on mount
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const servicesParam = searchParams.get('services');
    const addonsParam = searchParams.get('addons');
    const directServiceParam = searchParams.get('service');
    
    if (stepParam) {
      const stepNum = parseInt(stepParam, 10);
      if (stepNum >= 1 && stepNum <= 4) {
        setStep(stepNum);
      }
    }
    
    if (directServiceParam) {
      setFormData(prev => ({
        ...prev,
        selectedServices: [directServiceParam]
      }));
      setStep(1);
    } else if (servicesParam) {
      try {
        const selectedServices = JSON.parse(decodeURIComponent(servicesParam));
        const selectedAddons = addonsParam ? JSON.parse(decodeURIComponent(addonsParam)) : {};
        
        setFormData(prev => ({
          ...prev,
          selectedServices,
          selectedAddons
        }));
      } catch (error) {
        console.error('Failed to parse URL params:', error);
      }
    } else {
      // Fallback to localStorage if no URL params
      const savedSelections = localStorage.getItem('bookingSelections');
      if (savedSelections) {
        try {
          const parsed = JSON.parse(savedSelections);
          setFormData(prev => ({
            ...prev,
            selectedServices: parsed.selectedServices || [],
            selectedAddons: parsed.selectedAddons || {}
          }));
        } catch (error) {
          console.error('Failed to load saved selections:', error);
        }
      }
    }
  }, [searchParams]);

  // Update URL when step or selections change
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Don't add URL params on step 1 or step 5 (success page)
    if (step > 1 && step < 5) {
      params.set('step', step.toString());
      
      if (formData.selectedServices.length > 0) {
        params.set('services', encodeURIComponent(JSON.stringify(formData.selectedServices)));
        
        if (Object.keys(formData.selectedAddons).length > 0) {
          params.set('addons', encodeURIComponent(JSON.stringify(formData.selectedAddons)));
        }
        
        // Also save to localStorage as backup
        localStorage.setItem('bookingSelections', JSON.stringify({
          selectedServices: formData.selectedServices,
          selectedAddons: formData.selectedAddons
        }));
      }
    }
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/book';
    router.replace(newUrl, { scroll: false });
  }, [step, formData.selectedServices, formData.selectedAddons, router]);

  // Load existing bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        const data = await response.json();
        if (data.bookings) {
          setExistingBookings(data.bookings);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    
    const fetchBlockedDates = async () => {
      try {
        const response = await fetch('/api/blocked-dates');
        const data = await response.json();
        if (data.blockedDates) {
          setBlockedDates(data.blockedDates.map((d: any) => new Date(d.date)));
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error);
      }
    };

    fetchBookings();
    fetchBlockedDates();
  }, []);

  // Update available slots when date or selections change
  useEffect(() => {
    if (formData.appointmentDate && formData.selectedServices.length > 0) {
      setLoadingSlots(true);
      
      // Artificial delay for better UX
      const timer = setTimeout(() => {
        const slots = generateTimeSlots(
          formData.appointmentDate, 
          existingBookings, 
          formData.selectedServices, 
          formData.selectedAddons,
          services
        );
        setAvailableSlots(slots);
        setLoadingSlots(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.appointmentDate, formData.selectedServices, formData.selectedAddons, existingBookings, services]);

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(serviceId);
      const newSelectedServices = isSelected
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId];
      
      // Clear addons for removed service
      const newSelectedAddons = { ...prev.selectedAddons };
      if (isSelected) {
        delete newSelectedAddons[serviceId];
      }
      
      return {
        ...prev,
        selectedServices: newSelectedServices,
        selectedAddons: newSelectedAddons
      };
    });
  };

  const handleAddonSelect = (serviceId: string, addonId: string) => {
    setFormData(prev => {
      const serviceAddons = prev.selectedAddons[serviceId] || [];
      const isSelected = serviceAddons.includes(addonId);
      
      const newServiceAddons = isSelected
        ? serviceAddons.filter(id => id !== addonId)
        : [...serviceAddons, addonId];
      
      return {
        ...prev,
        selectedAddons: {
          ...prev.selectedAddons,
          [serviceId]: newServiceAddons
        }
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep1 = () => {
    if (formData.selectedServices.length === 0) {
      setBookingError('Please select at least one service');
      return false;
    }
    setBookingError('');
    return true;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    if (!formData.selectedTime) {
      setBookingError('Please select an appointment time');
      return false;
    }
    setBookingError('');
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const createInitialBooking = async () => {
    setLoading(true);
    setBookingError('');
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          totalPrice,
          totalDuration,
          status: 'pending'
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Failed to initialize booking');
      
      setPendingBookingId(result.booking._id);
      
      // Create Payment Intent
      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPrice * 100, // Stripe expects cents
          bookingId: result.booking._id,
          customerEmail: formData.email
        })
      });
      
      const paymentData = await paymentResponse.json();
      if (!paymentResponse.ok) throw new Error(paymentData.error || 'Failed to initialize payment');
      
      setClientSecret(paymentData.clientSecret);
      setPaymentIntentId(paymentData.paymentIntentId);
      setStep(4);
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(blockedDate => isSameDay(blockedDate, date));
  };

  if (step === 5) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4">Booking Confirmed!</h2>
        <p className="text-gray-400 mb-10 text-lg">
          Thank you for choosing LaidbyOma, {formData.firstName}! We've sent a confirmation email to {formData.email} with your appointment details.
        </p>
        <div className="bg-zinc-900 rounded-3xl p-8 mb-10 text-left border border-gray-800">
          <h3 className="font-bold text-xl mb-4 border-b border-gray-800 pb-4">Appointment Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">{format(formData.appointmentDate, 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Time</span>
              <span className="font-medium">{formData.selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Services</span>
              <div className="text-right">
                {selectedServices.map(s => <div key={s.id} className="font-medium">{s.name}</div>)}
              </div>
            </div>
            <div className="flex justify-between border-t border-gray-800 pt-4">
              <span className="font-bold">Total Paid</span>
              <span className="font-bold text-orange-500">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
        <Link href="/" className="inline-block px-8 py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step === i ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/20' : 
                step > i ? 'bg-green-500 text-white' : 'bg-zinc-800 text-gray-500'
              }`}>
                {step > i ? <CheckCircle className="w-6 h-6" /> : i}
              </div>
              <span className={`text-[10px] uppercase tracking-widest mt-2 font-bold ${step === i ? 'text-orange-500' : 'text-gray-500'}`}>
                {i === 1 ? 'Services' : i === 2 ? 'Details' : i === 3 ? 'Time' : 'Payment'}
              </span>
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-orange-500 transition-all duration-500 ease-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Select Services</h2>
                <p className="text-gray-400">Choose one or more services to book your transformation.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services or addons..."
                  className="w-full bg-zinc-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 bg-zinc-900 animate-pulse rounded-2xl"></div>
                  ))}
                </div>
              ) : (
                <ServiceList 
                  services={filteredServices}
                  selectedServices={formData.selectedServices}
                  selectedAddons={formData.selectedAddons}
                  onServiceSelect={handleServiceSelect}
                  onAddonSelect={handleAddonSelect}
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Your Details</h2>
                <p className="text-gray-400">Please provide your contact information for the booking.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900 border ${errors.firstName ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all`}
                      placeholder="Jane"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900 border ${errors.lastName ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900 border ${errors.email ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all`}
                      placeholder="jane@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full bg-zinc-900 border ${errors.phone ? 'border-red-500' : 'border-gray-800'} rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all`}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-gray-400 ml-1">Special Notes (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-zinc-900 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all resize-none"
                      placeholder="Tell us about any special requirements or preferences..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Choose Date & Time</h2>
                <p className="text-gray-400">Select your preferred appointment slot.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-zinc-900 p-6 rounded-3xl border border-gray-800">
                  <Calendar
                    onChange={(val) => setFormData(prev => ({ ...prev, appointmentDate: val as Date, selectedTime: '' }))}
                    value={formData.appointmentDate}
                    minDate={startOfToday()}
                    maxDate={addDays(startOfToday(), 60)}
                    tileDisabled={({ date }) => isDateBlocked(date)}
                    className="w-full bg-transparent border-none text-white"
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    Available Times for {format(formData.appointmentDate, 'MMM d')}
                  </h3>
                  
                  {loadingSlots ? (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="h-12 bg-zinc-900 animate-pulse rounded-xl"></div>
                      ))}
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setFormData(prev => ({ ...prev, selectedTime: slot.time }))}
                          className={`py-3 rounded-xl font-bold text-sm transition-all ${
                            formData.selectedTime === slot.time
                              ? 'bg-orange-500 text-white'
                              : slot.available
                              ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                              : 'bg-zinc-900/50 text-gray-700 cursor-not-allowed opacity-50'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-zinc-900/50 rounded-2xl border border-dashed border-gray-800">
                      <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500">No available slots for this date.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 4 && clientSecret && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Secure Payment</h2>
                <p className="text-gray-400">Complete your booking with a secure payment.</p>
              </div>

              <div className="bg-zinc-900 p-8 rounded-3xl border border-gray-800">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm 
                    amount={totalPrice} 
                    bookingId={pendingBookingId}
                    paymentIntentId={paymentIntentId}
                    onSuccess={() => setStep(5)}
                    onError={setBookingError}
                  />
                </Elements>
              </div>

              <div className="flex items-center gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                <CreditCard className="w-6 h-6 text-orange-500" />
                <p className="text-xs text-gray-400 leading-relaxed">
                  Your payment is processed securely via Stripe. We do not store your card details. A deposit is required to secure your appointment.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {bookingError && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 animate-in shake duration-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{bookingError}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex justify-between items-center">
            {step > 1 && step < 4 && (
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-400 hover:text-white font-bold transition-all px-6 py-3"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) || <div></div>}
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="px-10 py-4 bg-white text-black rounded-2xl font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105 ml-auto flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : step === 3 ? (
              <button
                disabled={loading}
                onClick={createInitialBooking}
                className="px-10 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 ml-auto flex items-center gap-2"
              >
                {loading ? 'Initializing...' : 'Proceed to Payment'}
                {!loading && <CreditCard className="w-5 h-5" />}
              </button>
            ) : null}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-zinc-900 rounded-3xl border border-gray-800 overflow-hidden">
              <div className="p-6 bg-orange-500/10 border-b border-gray-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-orange-500" />
                  Booking Summary
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                {selectedServices.length > 0 ? (
                  <div className="space-y-4">
                    {selectedServices.map(service => (
                      <div key={service.id} className="group">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-sm group-hover:text-orange-500 transition-colors">{service.name}</span>
                          <span className="text-sm font-medium">{formatCurrency(service.price)}</span>
                        </div>
                        {formData.selectedAddons[service.id]?.map(addonId => {
                          const addon = service.addons?.find(a => a.id === addonId);
                          return addon ? (
                            <div key={addonId} className="flex justify-between items-center text-xs text-gray-500 pl-3 border-l border-gray-800 ml-1 mt-1">
                              <span>+ {addon.name}</span>
                              <span>{formatCurrency(addon.price)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic text-center py-4">No services selected yet</p>
                )}

                <div className="pt-6 border-t border-gray-800 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-300">{formatDuration(totalDuration)}</span>
                  </div>
                  {formData.selectedTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Appointment</span>
                      <span className="font-medium text-gray-300">{format(formData.appointmentDate, 'MMM d')} @ {formData.selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold text-lg">Total</span>
                    <span className="text-2xl font-bold text-orange-500">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/50 flex items-center gap-3 border-t border-gray-800">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Live Availability Enabled</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-gray-800 space-y-4">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                Booking Policy
              </h4>
              <ul className="space-y-2">
                <li className="text-[11px] text-gray-500 leading-relaxed">• A non-refundable deposit is required.</li>
                <li className="text-[11px] text-gray-500 leading-relaxed">• Rescheduling is allowed up to 24h before.</li>
                <li className="text-[11px] text-gray-500 leading-relaxed">• Please arrive with clean, product-free hair.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
  </svg>
);

export default function BookPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold tracking-tight">
                Laid<span className="text-orange-500">byOma</span>
              </span>
            </Link>
            <div className="w-24"></div> {/* Spacer for symmetry */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading booking experience...</p>
          </div>
        }>
          <BookPageContent />
        </Suspense>
      </main>
    </div>
  );
}
