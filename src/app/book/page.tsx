'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import Calendar from 'react-calendar';
import { format, addDays, startOfToday } from 'date-fns';
import { ServiceCard } from '@/components/ServiceCard';
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

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    selectedServices: [],
    appointmentDate: new Date(),
    selectedTime: '',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const services = getServices();
  const selectedServices = services.filter(service => formData.selectedServices.includes(service.id));
  const totalPrice = calculateTotalPrice(formData.selectedServices);
  const totalDuration = calculateTotalDuration(formData.selectedServices);

  // Load existing bookings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      const bookings = JSON.parse(saved).map((booking: Booking) => ({
        ...booking,
        appointmentDate: new Date(booking.appointmentDate),
        createdAt: new Date(booking.createdAt),
        updatedAt: new Date(booking.updatedAt)
      }));
      setExistingBookings(bookings);
    }
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (formData.appointmentDate) {
      setLoadingSlots(true);
      // Add a small delay to show loading state
      const timeoutId = setTimeout(() => {
        const slots = generateTimeSlots(formData.appointmentDate, existingBookings);
        setAvailableSlots(slots);
        setLoadingSlots(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.appointmentDate, existingBookings]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
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
    try {
      // Call API to create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      // Save to localStorage for admin dashboard
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(result.booking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));

      setStep(4);
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Services</h2>
        <p className="text-gray-700">Choose the services you&apos;d like to book</p>
      </div>
      
      {errors.services && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {errors.services}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={handleServiceToggle}
            isSelected={formData.selectedServices.includes(service.id)}
          />
        ))}
      </div>

      {formData.selectedServices.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Services:</h3>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-gray-800">{service.name}</span>
                <span className="text-gray-800 font-medium">{formatCurrency(service.price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-rose-200 mt-2 pt-2 flex justify-between font-semibold text-gray-900">
            <span>Total: {formatDuration(totalDuration)}</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={formData.selectedServices.length === 0}
        className="w-full bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue to Date & Time
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 lg:space-y-8">
      <div className="text-center">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
        <p className="text-gray-700 text-sm lg:text-base">Choose your preferred appointment date and time</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        <div className="flex flex-col">
          <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Select Date</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Calendar
                  onChange={handleDateSelect as any}
                  value={formData.appointmentDate}
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 60)}
                  className="react-calendar"
                  tileDisabled={({ date, view }) => {
                    return view === 'month' && date < startOfToday();
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
          <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-lg h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              Available Times
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 mr-2 text-rose-500" />
              {format(formData.appointmentDate, 'EEEE, MMMM d, yyyy')}
            </p>
            
            {errors.time && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-red-600 text-xs font-bold">!</span>
                </div>
                {errors.time}
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="max-h-80 overflow-y-auto flex-1">
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-12 h-full">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                      <p className="text-gray-600 text-sm">Loading available times...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={slot.time}
                        onClick={() => setFormData(prev => ({ ...prev, selectedTime: slot.time }))}
                        disabled={!slot.available}
                        className={`p-2 lg:p-3 text-xs lg:text-sm font-medium rounded-lg border-2 transition-all duration-200 flex items-center justify-center min-h-[44px] lg:min-h-[48px] transform hover:scale-105 ${
                          formData.selectedTime === slot.time
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200 scale-105'
                            : slot.available
                            ? 'bg-white text-gray-800 border-gray-300 hover:border-rose-400 hover:bg-rose-50 hover:shadow-sm'
                            : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: loadingSlots ? 'none' : 'fadeIn 0.3s ease-out forwards'
                        }}
                      >
                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {!loadingSlots && availableSlots.filter(slot => slot.available).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-2">No available times</p>
                  <p className="text-gray-500 text-sm">Please select another date to see available time slots.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Services
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.selectedTime}
          className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Details
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Information</h2>
        <p className="text-gray-700">Please provide your contact details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 placeholder-gray-500 bg-white ${
              errors.firstName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 placeholder-gray-500 bg-white ${
              errors.lastName ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 placeholder-gray-500 bg-white ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 placeholder-gray-500 bg-white ${
              errors.phone ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Additional Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-gray-900 placeholder-gray-500 bg-white"
          placeholder="Any special requests or notes for your appointment..."
        />
      </div>

      {/* Booking Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Date:</span>
            <span className="font-medium text-gray-900">{format(formData.appointmentDate, 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Time:</span>
            <span className="font-medium text-gray-900">{formData.selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Duration:</span>
            <span className="font-medium text-gray-900">{formatDuration(totalDuration)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleBack}
          className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Date & Time
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 bg-rose-600 text-white py-3 rounded-lg font-semibold hover:bg-rose-700 disabled:bg-rose-400 transition-colors"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <div className="text-green-600 text-2xl">✓</div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
      <p className="text-xl text-gray-700">
        Thank you, {formData.firstName}! Your appointment has been successfully booked.
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">Appointment Details:</h3>
        <div className="space-y-2 text-sm">
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
            <span className="font-medium text-gray-900">{selectedServices.length} service(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Total:</span>
            <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700">
          A confirmation email has been sent to {formData.email}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors text-center"
          >
            Back to Home
          </Link>
          <button
            onClick={() => {
              setStep(1);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                selectedServices: [],
                appointmentDate: new Date(),
                selectedTime: '',
                notes: ''
              });
            }}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Book Another
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:justify-start h-16">
            <Link href="/" className="flex items-center text-rose-600 hover:text-rose-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-rose-600 sm:ml-8">
              <span className="hidden sm:inline">Book Appointment</span>
              <span className="sm:hidden">Book</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step < 4 && (
        <div className="bg-white border-b">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-center sm:justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber
                        ? 'bg-rose-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  <span
                    className={`ml-2 text-xs sm:text-sm font-medium ${
                      step >= stepNumber ? 'text-rose-600' : 'text-gray-600'
                    }`}
                  >
                    {stepNumber === 1 ? 'Services' : stepNumber === 2 ? 'Date & Time' : 'Details'}
                  </span>
                  {stepNumber < 3 && (
                    <div className="flex-1 h-1 bg-gray-200 mx-2 sm:mx-4 rounded min-w-[20px] sm:min-w-[40px]">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          step > stepNumber ? 'bg-rose-600 w-full' : 'bg-gray-200 w-0'
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
