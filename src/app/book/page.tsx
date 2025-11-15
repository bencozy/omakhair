'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare, AlertCircle, CheckCircle, DollarSign, CreditCard } from 'lucide-react';
import Calendar from 'react-calendar';
import { format, addDays, startOfToday } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ServiceList } from '@/components/ServiceList';
import { PaymentForm } from '@/components/PaymentForm';
import { BookingFormData, TimeSlot, Booking } from '@/types';
import { 
  getServices, 
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
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookingError, setBookingError] = useState<string>('');
  const [pendingBookingId, setPendingBookingId] = useState<string>('');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');

  const services = getServices();
  const selectedServices = services.filter(service => formData.selectedServices.includes(service.id));
  const totalPrice = calculateTotalPrice(formData.selectedServices, formData.selectedAddons);
  const totalDuration = calculateTotalDuration(formData.selectedServices, formData.selectedAddons);

  // Load state from URL on mount
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const servicesParam = searchParams.get('services');
    const addonsParam = searchParams.get('addons');
    
    if (stepParam) {
      const stepNum = parseInt(stepParam, 10);
      if (stepNum >= 1 && stepNum <= 4) {
        setStep(stepNum);
      }
    }
    
    if (servicesParam) {
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
          const bookings = data.bookings.map((booking: any) => {
            // Parse appointment date without timezone conversion
            const dateStr = booking.appointmentDate.split('T')[0]; // Get YYYY-MM-DD
            const [year, month, day] = dateStr.split('-').map(Number);
            const appointmentDate = new Date(year, month - 1, day); // month is 0-indexed
            
            return {
              id: booking._id,
              customerId: booking.customerId._id || booking.customerId,
              customer: typeof booking.customerId === 'object' ? {
                id: booking.customerId._id,
                firstName: booking.customerId.firstName,
                lastName: booking.customerId.lastName,
                email: booking.customerId.email,
                phone: booking.customerId.phone
              } : booking.customer,
              serviceIds: booking.serviceIds,
              services: booking.services,
              appointmentDate,
              startTime: booking.startTime,
              endTime: booking.endTime,
              totalPrice: booking.totalPrice,
              discountAmount: booking.discountAmount || 0,
              finalPrice: booking.finalPrice,
              status: booking.status,
              notes: booking.notes || '',
              createdAt: new Date(booking.createdAt),
              updatedAt: new Date(booking.updatedAt)
            };
          });
          console.log('Loaded bookings for time blocking:', bookings.map(b => ({
            date: b.appointmentDate,
            time: `${b.startTime}-${b.endTime}`,
            status: b.status
          })));
          setExistingBookings(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setExistingBookings([]);
      }
    };
    
    fetchBookings();
  }, []);

  // Load blocked dates from API
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await fetch('/api/blocked-dates');
        const data = await response.json();
        
        if (data.blockedDates) {
          const dates = data.blockedDates.map((item: any) => {
            // Parse date without timezone conversion
            const dateStr = item.date.split('T')[0];
            const [year, month, day] = dateStr.split('-').map(Number);
            return new Date(year, month - 1, day);
          });
          setBlockedDates(dates);
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error);
      }
    };
    
    fetchBlockedDates();
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      setLoadingSlots(true);
      // Add a small delay to show loading state
      const timeoutId = setTimeout(() => {
        const slots = generateTimeSlots(
        formData.appointmentDate, 
        existingBookings, 
        formData.selectedServices, 
        formData.selectedAddons
      );
        setAvailableSlots(slots);
        setLoadingSlots(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.appointmentDate, existingBookings, formData.selectedServices, formData.selectedAddons]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => {
      const isRemoving = prev.selectedServices.includes(serviceId);
      const newSelectedServices = isRemoving
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId];
      
      // If removing service, also remove its addons
      const newSelectedAddons = { ...prev.selectedAddons };
      if (isRemoving) {
        delete newSelectedAddons[serviceId];
      }
      
      return {
        ...prev,
        selectedServices: newSelectedServices,
        selectedAddons: newSelectedAddons
      };
    });
  };

  const handleAddonToggle = (serviceId: string, addonId: string) => {
    setFormData(prev => {
      const currentAddons = prev.selectedAddons[serviceId] || [];
      const newAddons = currentAddons.includes(addonId)
        ? currentAddons.filter(id => id !== addonId)
        : [...currentAddons, addonId];
      
      return {
        ...prev,
        selectedAddons: {
          ...prev.selectedAddons,
          [serviceId]: newAddons
        }
      };
    });
  };

  const handleDateSelect = (value: Date | Date[] | null) => {
    if (value && value instanceof Date) {
      setFormData(prev => ({ ...prev, appointmentDate: value, selectedTime: '' }));
      // Clear any previous time selection error when date changes
      if (errors.time) {
        setErrors(prev => ({ ...prev, time: '' }));
      }
    }
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (formData.selectedServices.length === 0) {
        newErrors.services = 'Please select at least one service';
      }
    } else if (stepNumber === 2) {
      if (!formData.selectedTime) {
        newErrors.time = 'Please select an appointment time';
      }
    } else if (stepNumber === 3) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    setBookingError('');
    
    try {
      const year = formData.appointmentDate.getFullYear();
      const month = String(formData.appointmentDate.getMonth() + 1).padStart(2, '0');
      const day = String(formData.appointmentDate.getDate()).padStart(2, '0');
      const localDateString = `${year}-${month}-${day}T00:00:00`;

      const bookingResponse = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          appointmentDate: localDateString,
        }),
      });

      const bookingResult = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(bookingResult.error || 'Failed to create booking');
      }

      const bookingId = bookingResult.booking._id || bookingResult.booking.id;
      setPendingBookingId(bookingId);

      const paymentResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create-intent',
          bookingId: bookingId,
          amount: 30,
          currency: 'usd',
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentResult.error || 'Failed to create payment intent');
      }

      setClientSecret(paymentResult.clientSecret);
      setPaymentIntentId(paymentResult.paymentIntentId);
      setBookingError('');
      setStep(4);
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingError(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      const confirmResponse = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'confirm',
          paymentIntentId: paymentIntentId,
          bookingId: pendingBookingId,
        }),
      });

      const confirmResult = await confirmResponse.json();

      if (!confirmResponse.ok) {
        throw new Error(confirmResult.error || 'Failed to confirm payment');
      }

      localStorage.removeItem('bookingSelections');
      
      // Redirect to success page with booking details
      const params = new URLSearchParams({
        firstName: formData.firstName,
        date: format(formData.appointmentDate, 'MMMM d, yyyy'),
        time: formData.selectedTime,
        services: `${selectedServices.length} service(s)`,
        total: formatCurrency(totalPrice),
        email: formData.email,
      });
      
      router.push(`/book/success?${params.toString()}`);
    } catch (error: any) {
      console.error('Payment confirmation error:', error);
      setBookingError(error.message || 'Failed to confirm payment. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (error: string) => {
    setBookingError(error);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Select Services</h2>
        <p className="text-gray-400">Choose the services you&apos;d like to book</p>
      </div>

      {/* Important Information - Moved to Top */}
      <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-orange-500 rounded-full p-2.5 flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-black" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">Important Information</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Please review our booking instructions before scheduling your appointment
              </p>
            </div>
          </div>
          <Link 
            href="/instructions" 
            className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all hover:scale-105 text-center shadow-lg whitespace-nowrap"
          >
            View Instructions
          </Link>
        </div>
      </div>
      
      {errors.services && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
          {errors.services}
        </div>
      )}

      <ServiceList
        services={services}
        selectedServices={formData.selectedServices}
        selectedAddons={formData.selectedAddons}
        onServiceToggle={handleServiceToggle}
        onAddonToggle={handleAddonToggle}
      />

      {formData.selectedServices.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="font-bold text-white mb-4 text-lg">Selected Services:</h3>
          <div className="space-y-3">
            {selectedServices.map((service) => {
              const serviceAddons = formData.selectedAddons[service.id] || [];
              const addonTotal = serviceAddons.reduce((total, addonId) => {
                const addon = service.addons?.find(a => a.id === addonId);
                return total + (addon?.price || 0);
              }, 0);
              
              return (
                <div key={service.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300 font-medium">{service.name}</span>
                    <span className="text-white font-semibold">{formatCurrency(service.price)}</span>
                  </div>
                  {serviceAddons.length > 0 && (
                    <div className="pl-4 space-y-1">
                      {serviceAddons.map(addonId => {
                        const addon = service.addons?.find(a => a.id === addonId);
                        return addon ? (
                          <div key={addonId} className="flex justify-between text-xs text-gray-400">
                            <span>+ {addon.name}</span>
                            <span className="text-orange-400">+{formatCurrency(addon.price)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between font-bold text-lg">
            <span className="text-gray-300">Total: {formatDuration(totalDuration)}</span>
            <span className="text-orange-500">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={formData.selectedServices.length === 0}
        className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500 transition-all hover:scale-[1.02] shadow-lg"
      >
        Continue to Date & Time
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">Select Date & Time</h2>
        <p className="text-gray-400 text-sm lg:text-base">Choose your preferred appointment date and time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 lg:p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Select Date</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Calendar
                  onChange={handleDateSelect as any}
                  value={formData.appointmentDate}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 60)}
                  className="react-calendar-dark"
                  tileDisabled={({ date, view }) => {
                    if (view !== 'month') return false;
                    
                    // Disable past dates
                    if (date < startOfToday()) return true;
                    
                    // Disable blocked dates
                    const isBlocked = blockedDates.some(blockedDate => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const blockedDateStr = format(blockedDate, 'yyyy-MM-dd');
                      return dateStr === blockedDateStr;
                    });
                    
                    return isBlocked;
                  }}
                  showNeighboringMonth={false}
                  next2Label={null}
                  prev2Label={null}
                  formatShortWeekday={(locale, date) => format(date, 'EEE')}
                  formatMonthYear={(locale, date) => format(date, 'MMMM yyyy')}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-4 lg:p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 text-center">
              Available Times
            </h3>
            <p className="text-sm text-gray-300 mb-2 text-center flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-orange-500" />
              {format(formData.appointmentDate, 'EEEE, MMMM d, yyyy')}
            </p>
            {totalDuration > 0 && (
              <p className="text-xs text-gray-400 mb-4 text-center">
                Your service takes {formatDuration(totalDuration)}
              </p>
            )}
            
            {errors.time && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4 flex items-center">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-400 text-xs font-bold">!</span>
                </div>
                {errors.time}
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="max-h-80 overflow-y-auto flex-1">
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-12 h-full">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <p className="text-gray-400 text-sm">Loading available times...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={slot.time}
                        onClick={() => setFormData(prev => ({ ...prev, selectedTime: slot.time }))}
                        disabled={!slot.available}
                        className={`p-3 text-sm font-bold rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px] ${
                          formData.selectedTime === slot.time
                            ? 'bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/30 scale-105'
                            : slot.available
                            ? 'bg-gray-800 text-white border-gray-700 hover:border-orange-500 hover:bg-gray-700 hover:shadow-md'
                            : 'bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed opacity-40'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: loadingSlots ? 'none' : 'fadeIn 0.3s ease-out forwards'
                        }}
                        title={!slot.available && slot.bookingId ? `Would overlap with existing booking` : !slot.available ? 'Outside business hours or service would extend beyond closing time' : `Available for ${formatDuration(totalDuration)} service`}
                      >
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap">{slot.time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!loadingSlots && availableSlots.filter(slot => slot.available).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                    <Clock className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-white font-semibold mb-2">No available times</p>
                  <p className="text-gray-400 text-sm">Please select another date to see available time slots.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      {formData.selectedServices.length > 0 && (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-orange-500" />
            Booking Summary
          </h3>
          <div className="space-y-4">
            {selectedServices.map((service) => {
              const serviceAddons = formData.selectedAddons[service.id] || [];
              const addonTotal = serviceAddons.reduce((total, addonId) => {
                const addon = service.addons?.find(a => a.id === addonId);
                return total + (addon?.price || 0);
              }, 0);
              
              return (
                <div key={service.id} className="pb-3 border-b border-gray-700 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{service.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(service.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {serviceAddons.length > 0 && (
                    <div className="ml-4 space-y-1 mt-2">
                      {serviceAddons.map(addonId => {
                        const addon = service.addons?.find(a => a.id === addonId);
                        return addon ? (
                          <div key={addonId} className="flex justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                              {addon.name}
                            </span>
                            <span className="text-orange-400">+{formatCurrency(addon.price)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Total Duration</p>
              <p className="text-lg font-bold text-white">{formatDuration(totalDuration)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Price</p>
              <p className="text-2xl font-bold text-orange-500">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-700 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-lg"
        >
          Back to Services
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.selectedTime}
          className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all hover:scale-[1.02] shadow-lg text-lg"
        >
          Continue to Details
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Information</h2>
        <p className="text-gray-400">Please provide your contact details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <User className="w-4 h-4 inline mr-2 text-orange-500" />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 bg-gray-800 transition-all ${
              errors.firstName ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <User className="w-4 h-4 inline mr-2 text-orange-500" />
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 bg-gray-800 transition-all ${
              errors.lastName ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <Mail className="w-4 h-4 inline mr-2 text-orange-500" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 bg-gray-800 transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            <Phone className="w-4 h-4 inline mr-2 text-orange-500" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 bg-gray-800 transition-all ${
              errors.phone ? 'border-red-500' : 'border-gray-700'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2 text-orange-500" />
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-500 bg-gray-800 transition-all"
          placeholder="Any special requests or notes for your appointment..."
        />
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Booking Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Date:</span>
            <span className="font-medium text-white">{format(formData.appointmentDate, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Time:</span>
            <span className="font-medium text-white">{formData.selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Duration:</span>
            <span className="font-medium text-white">{formatDuration(totalDuration)}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex justify-between text-xl font-bold">
              <span className="text-gray-300">Total:</span>
              <span className="text-orange-500">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-5">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-orange-500" />
          Important Information
        </h4>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Please arrive 10 minutes early for your appointment</p>
          <p>• 24-hour cancellation policy applies</p>
          <p>• Payment is due at time of service</p>
          <p>• Bring any required items as specified for your service</p>
        </div>
      </div>

      {bookingError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 font-semibold">Booking Failed</p>
            <p className="text-red-300 text-sm mt-1">{bookingError}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-700 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-lg"
        >
          Back to Date & Time
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg text-lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creating Booking...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Continue to Payment
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold text-black mb-2 tracking-tight">Complete Payment</h2>
        <p className="text-gray-600">Secure your booking with a $30 payment</p>
      </div>

      {bookingError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Payment Error</p>
            <p className="text-red-700 text-sm mt-1">{bookingError}</p>
          </div>
        </div>
      )}

      {/* Booking Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Name:</span>
            <span className="font-medium text-gray-900">{formData.firstName} {formData.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Date:</span>
            <span className="font-medium text-gray-900">{format(formData.appointmentDate, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Time:</span>
            <span className="font-medium text-gray-900">{formData.selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Services:</span>
            <span className="font-medium text-gray-900">{selectedServices.map(s => s.name).join(', ')}</span>
          </div>
          <div className="border-t border-gray-300 pt-2 mt-2">
            <div className="flex justify-between text-base">
              <span className="text-gray-700">Total Service Price:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-black mt-2">
              <span>Booking Payment:</span>
              <span>$30.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Policy Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Payment & Cancellation Policy
        </h4>
        <div className="space-y-2 text-sm text-blue-900">
          <p>• $30 booking payment required to confirm your appointment</p>
          <p>• Cancel 48+ hours before: Full refund</p>
          <p>• Cancel 24-48 hours before: 50% refund ($15)</p>
          <p>• Cancel less than 24 hours: No refund</p>
          <p>• Remaining balance of {formatCurrency(totalPrice - 30)} due at appointment</p>
        </div>
      </div>

      {/* Stripe Payment Form */}
      {clientSecret && (
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#000000',
                colorBackground: '#ffffff',
                colorText: '#000000',
                colorDanger: '#dc2626',
                fontFamily: 'system-ui, sans-serif',
                borderRadius: '8px',
              },
            },
          }}
        >
          <PaymentForm 
            bookingId={pendingBookingId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </Elements>
      )}

      {!clientSecret && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="text-gray-600 text-sm">Preparing payment...</p>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setStep(3)}
          className="text-gray-600 hover:text-black transition-colors text-sm"
        >
          ← Back to Details
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-black/95 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:justify-start h-20">
            <Link href="/" className="flex items-center text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline font-medium">Back</span>
              <span className="sm:hidden font-medium">Back</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold sm:ml-8 tracking-tight">
              <span className="hidden sm:inline">Book <span className="text-orange-500">Appointment</span></span>
              <span className="sm:hidden">Book</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="bg-black border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-center sm:justify-between">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber
                        ? 'bg-orange-500 text-black'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`ml-2 text-xs sm:text-sm font-medium ${
                      step >= stepNumber ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {stepNumber === 1 ? 'Services' : stepNumber === 2 ? 'Date & Time' : stepNumber === 3 ? 'Details' : 'Payment'}
                  </span>
                  {stepNumber < 4 && (
                    <div className="flex-1 h-1 bg-gray-800 mx-2 sm:mx-4 rounded min-w-[15px] sm:min-w-[30px]">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          step > stepNumber ? 'bg-orange-500 w-full' : 'bg-gray-800 w-0'
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </main>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  );
}
