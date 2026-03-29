'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle, DollarSign, CreditCard, Search, ChevronRight, Check, X } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/modal';

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
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<{ status: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ status: 'idle' });

  // Fetch services and initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [servicesRes, blockedRes, bookingsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/blocked-dates'),
          fetch('/api/bookings')
        ]);
        
        const servicesData = await servicesRes.json();
        const blockedData = await blockedRes.json();
        const bookingsData = await bookingsRes.json();

        if (servicesData.services) setServices(servicesData.services);
        if (blockedData.blockedDates) setBlockedDates(blockedData.blockedDates.map((d: any) => new Date(d.date)));
        if (bookingsData.bookings) setExistingBookings(bookingsData.bookings);

        const serviceId = searchParams.get('service');
        if (serviceId) {
          setFormData(prev => ({ ...prev, selectedServices: [serviceId] }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  // Update time slots when date or services change
  useEffect(() => {
    if (formData.appointmentDate && formData.selectedServices.length > 0) {
      setLoadingSlots(true);
      const totalDuration = calculateTotalDuration(formData.selectedServices, formData.selectedAddons, services);
      const slots = generateTimeSlots(formData.appointmentDate, totalDuration, existingBookings);
      setAvailableSlots(slots);
      setLoadingSlots(false);
    }
  }, [formData.appointmentDate, formData.selectedServices, formData.selectedAddons, existingBookings, services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const query = searchQuery.toLowerCase();
      return service.name.toLowerCase().includes(query) || 
             service.category.toLowerCase().includes(query) ||
             service.description.toLowerCase().includes(query);
    });
  }, [services, searchQuery]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedServices.includes(serviceId);
      if (isSelected) {
        const { [serviceId]: _, ...restAddons } = prev.selectedAddons;
        return {
          ...prev,
          selectedServices: prev.selectedServices.filter(id => id !== serviceId),
          selectedAddons: restAddons
        };
      } else {
        return {
          ...prev,
          selectedServices: [...prev.selectedServices, serviceId]
        };
      }
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.services;
      return newErrors;
    });
  };

  const handleAddonToggle = (serviceId: string, addonId: string) => {
    setFormData(prev => {
      const currentAddons = prev.selectedAddons[serviceId] || [];
      const isSelected = currentAddons.includes(addonId);
      
      return {
        ...prev,
        selectedAddons: {
          ...prev.selectedAddons,
          [serviceId]: isSelected 
            ? currentAddons.filter(id => id !== addonId)
            : [...currentAddons, addonId]
        }
      };
    });
  };

  const handleJoinWaitlist = async () => {
    if (!formData.appointmentDate || formData.selectedServices.length === 0) return;
    
    setWaitlistStatus({ status: 'loading' });
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: formData.selectedServices[0],
          requestedDate: formData.appointmentDate.toISOString()
        })
      });

      if (response.ok) {
        setWaitlistStatus({ status: 'success', message: "You've been added to the waitlist! We'll notify you if a slot opens up." });
      } else {
        const error = await response.json();
        setWaitlistStatus({ status: 'error', message: error.message || "Something went wrong." });
      }
    } catch (error) {
      setWaitlistStatus({ status: 'error', message: "Failed to join waitlist. Please try again later." });
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (formData.selectedServices.length === 0) {
        newErrors.services = 'Please select at least one service.';
      }
    } else if (currentStep === 2) {
      if (!formData.selectedTime) newErrors.time = 'Please select an appointment time.';
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
      if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email.';
      if (!validatePhone(formData.phone)) newErrors.phone = 'Please enter a valid phone number.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = async () => {
    if (validateStep(step)) {
      if (step === 2) {
        setLoading(true);
        try {
          const totalAmount = calculateTotalPrice(formData.selectedServices, formData.selectedAddons, services);
          const totalDuration = calculateTotalDuration(formData.selectedServices, formData.selectedAddons, services);

          // 1. Create a pending booking first to get a bookingId
          const bookingResponse = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              ...formData,
              totalAmount,
              totalDuration,
              paymentStatus: 'unpaid',
              status: 'pending'
            }),
          });
          
          const bookingData = await bookingResponse.json();
          if (!bookingResponse.ok) throw new Error(bookingData.error || 'Failed to create booking');
          
          const bookingId = bookingData.booking.id;
          setPendingBookingId(bookingId);

          // 2. Initialize payment with the bookingId
          const response = await fetch('/api/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              action: 'create-intent',
              amount: totalAmount,
              bookingId: bookingId
            }),
          });
          
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Failed to initialize payment');
          
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setStep(3);
        } catch (error: any) {
          console.error('Error initializing payment:', error);
          setBookingError(error.message || 'Failed to initialize payment. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const totalAmount = calculateTotalPrice(formData.selectedServices, formData.selectedAddons, services);

      // Confirm payment on backend
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'confirm',
          paymentIntentId,
          bookingId: pendingBookingId
        }),
      });

      if (response.ok) {
        const selectedServiceNames = formData.selectedServices
          .map(id => services.find(s => s.id === id)?.name)
          .join(', ');
        
        const queryParams = new URLSearchParams({
          firstName: formData.firstName,
          date: format(formData.appointmentDate, 'MMMM d, yyyy'),
          time: formData.selectedTime,
          services: selectedServiceNames,
          total: formatCurrency(totalAmount),
          email: formData.email
        });
        router.push(`/book/success?${queryParams.toString()}`);
      } else {
        const errorData = await response.json();
        setBookingError(errorData.error || 'Failed to save booking. Please contact support.');
      }
    } catch (error) {
      setBookingError('An error occurred while saving your booking.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Services', icon: <Search className="w-5 h-5" /> },
    { number: 2, title: 'Details', icon: <CalendarIcon className="w-5 h-5" /> },
    { number: 3, title: 'Payment', icon: <CreditCard className="w-5 h-5" /> }
  ];

  if (loading && step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-gray-100">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group text-xs font-bold uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Cancel</span>
          </Link>
          <div className="flex items-center">
            <span className="text-xl font-serif font-bold tracking-tight">
              Laid<span className="text-black">byOma</span>
            </span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-20">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-100 -translate-y-1/2 -z-10" />
              {steps.map((s, i) => (
                <div key={s.number} className="flex flex-col items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    step >= s.number ? 'bg-white border-black text-black' : 'bg-white border-gray-100 text-gray-300'
                  }`}>
                    {step > s.number ? <Check className="w-5 h-5" /> : s.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${
                    step >= s.number ? 'text-black' : 'text-gray-300'
                  }`}>{s.title}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <h2 className="text-4xl font-serif font-bold mb-4">Choose Your Service.</h2>
                  <p className="text-gray-700">Select the treatments you&apos;d like to receive today.</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50/50 border border-gray-100 rounded-full text-sm focus:bg-white focus:border-black transition-all outline-none text-black"
                  />
                </div>

                {errors.services && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
                    <AlertCircle className="w-5 h-5" />
                    {errors.services}
                  </div>
                )}

                <ServiceList
                  services={filteredServices}
                  selectedServices={formData.selectedServices}
                  selectedAddons={formData.selectedAddons}
                  onServiceToggle={handleServiceToggle}
                  onAddonToggle={handleAddonToggle}
                />

                <div className="pt-10 flex justify-center">
                  <button
                    onClick={nextStep}
                    className="px-12 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-30 flex items-center gap-3 group"
                    disabled={formData.selectedServices.length === 0}
                  >
                    Continue to Details
                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-5 gap-16"
              >
                <div className="lg:col-span-3 space-y-12">
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8 text-gray-700 flex items-center gap-3">
                      <span className="w-8 h-[1px] bg-gray-300" />
                      Select Appointment Time
                    </h3>
                    
                    <div 
                      onClick={() => setIsCalendarModalOpen(true)}
                      className="group cursor-pointer bg-white border border-gray-100 rounded-[32px] p-10 shadow-sm hover:shadow-xl hover:border-black transition-all duration-500 flex flex-col items-center text-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black transition-colors duration-500">
                        <CalendarIcon className="w-8 h-8 text-black group-hover:text-white transition-colors duration-500" />
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase tracking-widest text-black mb-2">
                          {format(formData.appointmentDate, 'EEEE, MMMM do')}
                        </div>
                        <div className="text-2xl font-serif font-bold italic text-black">
                          {formData.selectedTime ? formData.selectedTime : 'Choose Your Slot'}
                        </div>
                      </div>
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 group-hover:border-black group-hover:text-black transition-all">
                        Change Date & Time
                      </div>
                    </div>

                    <Modal 
                      isOpen={isCalendarModalOpen} 
                      onClose={() => setIsCalendarModalOpen(false)}
                      title="Select Appointment Date & Time"
                      maxWidth="max-w-5xl"
                    >
                      <div className="flex flex-col md:flex-row gap-12 items-start h-full">
                        <div className="flex-1 w-full space-y-6">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-3 px-2">
                            1. Pick a Date
                            <div className="flex-1 h-[1px] bg-gray-100" />
                          </h4>
                          <div className="bg-white/50 rounded-[32px] p-6 border border-gray-50 shadow-sm">
                            <Calendar
                              onChange={(d) => setFormData(prev => ({ ...prev, appointmentDate: d as Date }))}
                              value={formData.appointmentDate}
                              minDate={startOfToday()}
                              maxDate={addDays(new Date(), 60)}
                              className="w-full border-none font-sans"
                              tileDisabled={({ date }) => blockedDates.some(bd => bd.toDateString() === date.toDateString())}
                            />
                          </div>
                        </div>

                        <div className="hidden md:block w-[1px] h-[500px] bg-gray-100 self-center" />

                        <div className="flex-1 w-full space-y-6 flex flex-col h-full">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-3 px-2">
                            2. Select a Time
                            <div className="flex-1 h-[1px] bg-gray-100" />
                          </h4>
                          
                          <div className="flex flex-col gap-8 h-full">
                            <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {loadingSlots ? (
                                  Array(9).fill(0).map((_, i) => (
                                    <div key={i} className="h-14 bg-gray-50/80 rounded-2xl animate-pulse" />
                                  ))
                                ) : availableSlots.length > 0 ? (
                                  availableSlots.map((slot) => (
                                    <button
                                      key={slot.time}
                                      onClick={() => {
                                        setFormData(prev => ({ ...prev, selectedTime: slot.time }));
                                      }}
                                      className={`py-4 px-2 rounded-2xl text-[11px] font-bold transition-all duration-300 border-2 ${
                                        formData.selectedTime === slot.time
                                          ? 'bg-black text-white border-black shadow-lg -translate-y-0.5'
                                          : 'bg-white text-gray-600 hover:border-black/30 border-gray-50 hover:bg-gray-50'
                                      }`}
                                    >
                                      {slot.time}
                                    </button>
                                  ))
                                ) : (
                                  <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                                      <Clock className="w-6 h-6 text-gray-300" />
                                    </div>
                                    <p className="text-gray-400 text-xs italic font-medium px-4">No available times for this date.</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 mt-auto">
                              <button
                                onClick={() => setIsCalendarModalOpen(false)}
                                disabled={!formData.selectedTime}
                                className="w-full py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                              >
                                {formData.selectedTime ? `Confirm ${formData.selectedTime}` : 'Select a Slot'}
                                {formData.selectedTime && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </section>

                  <section>
                    <h3 className="text-xl font-serif font-bold text-black border-b border-gray-100 pb-6 mb-8 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-nude-peach flex items-center justify-center text-xs">03</div>
                      Personal Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">First Name</label>
                        <input
                          type="text"
                          placeholder="Jane"
                          value={formData.firstName}
                          onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-black transition-all outline-none text-black"
                        />
                        {errors.firstName && <span className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.firstName}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Last Name</label>
                        <input
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-black transition-all outline-none text-black"
                        />
                        {errors.lastName && <span className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.lastName}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Email Address</label>
                        <input
                          type="email"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-black transition-all outline-none text-black"
                        />
                        {errors.email && <span className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.email}</span>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-sm focus:border-black transition-all outline-none text-black"
                        />
                        {errors.phone && <span className="text-red-500 text-[10px] ml-4 font-bold uppercase">{errors.phone}</span>}
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-4">Special Instructions (Optional)</label>
                        <textarea
                          placeholder="Any details you'd like us to know..."
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          className="w-full p-5 bg-white border border-gray-100 rounded-2xl text-sm focus:border-black transition-all outline-none resize-none text-black"
                          rows={4}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="flex items-center justify-between pt-10">
                    <button onClick={prevStep} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">Go Back</button>
                    <button
                      onClick={nextStep}
                      className="px-12 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs disabled:opacity-30 flex items-center gap-3 group"
                      disabled={loading}
                    >
                      {loading ? 'Initializing...' : 'Confirm & Pay'}
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="sticky top-32">
                    <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 h-fit">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-10 pb-4 border-b border-gray-200">Booking Summary</h4>
                      <div className="space-y-8 mb-10">
                        {formData.selectedServices.map(sid => {
                          const s = services.find(x => x.id === sid);
                          return (
                            <div key={sid}>
                              <div className="text-sm font-bold text-black mb-1">{s?.name}</div>
                              <div className="text-xs text-gray-400 uppercase tracking-widest">{s?.category}</div>
                            </div>
                          );
                        })}
                        {formData.appointmentDate && formData.selectedTime && (
                          <div className="pt-8 border-t border-gray-200">
                            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Appointment</div>
                            <div className="text-sm font-bold text-black">{format(formData.appointmentDate, 'MMMM d, yyyy')}</div>
                            <div className="text-sm font-bold text-black mt-1">{formData.selectedTime}</div>
                          </div>
                        )}
                      </div>
                      <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Total Deposit</span>
                        <span className="text-2xl font-serif font-bold text-black">
                          {formatCurrency(calculateTotalPrice(formData.selectedServices, formData.selectedAddons, services))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="text-center">
                  <h2 className="text-4xl font-serif font-bold mb-4">Complete Payment.</h2>
                  <p className="text-gray-500">Secure your appointment with a deposit.</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                  <div className="max-w-md mx-auto">
                    {clientSecret && (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm 
                          bookingId={pendingBookingId}
                          onSuccess={handlePaymentSuccess} 
                          amount={calculateTotalPrice(formData.selectedServices, formData.selectedAddons, services)}
                        />
                      </Elements>
                    )}
                    {!clientSecret && (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-10 h-10 border-4 border-nude-peach border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-medium">Preparing secure checkout...</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Studio...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
