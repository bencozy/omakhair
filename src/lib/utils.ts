import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addMinutes, isBefore, isAfter, isSameDay, parseISO } from 'date-fns'
import { Service, Booking, TimeSlot } from '@/types'
import servicesData from '@/data/services.json'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) {
    return `${mins}m`
  }
  if (mins === 0) {
    return `${hours}h`
  }
  return `${hours}h ${mins}m`
}

export function getServices(): Service[] {
  return servicesData.services as Service[]
}

export function getServiceById(id: string): Service | undefined {
  return getServices().find(service => service.id === id)
}

export function calculateTotalDuration(serviceIds: string[], selectedAddons: { [serviceId: string]: string[] } = {}): number {
  const services = serviceIds.map(id => getServiceById(id)).filter(Boolean) as Service[]
  
  return services.reduce((total, service) => {
    let serviceDuration = service.duration
    
    // Add addon durations
    const addons = selectedAddons[service.id] || []
    addons.forEach(addonId => {
      const addon = service.addons?.find(a => a.id === addonId)
      if (addon) {
        serviceDuration += addon.duration
      }
    })
    
    return total + serviceDuration
  }, 0)
}

export function calculateTotalPrice(serviceIds: string[], selectedAddons: { [serviceId: string]: string[] } = {}): number {
  const services = serviceIds.map(id => getServiceById(id)).filter(Boolean) as Service[]
  
  return services.reduce((total, service) => {
    let serviceTotal = service.price
    
    // Add addon prices
    const addons = selectedAddons[service.id] || []
    addons.forEach(addonId => {
      const addon = service.addons?.find(a => a.id === addonId)
      if (addon) {
        serviceTotal += addon.price
      }
    })
    
    return total + serviceTotal
  }, 0)
}

export function generateTimeSlots(
  date: Date, 
  existingBookings: Booking[] = [], 
  selectedServiceIds: string[] = [], 
  selectedAddons: { [serviceId: string]: string[] } = {}
): TimeSlot[] {
  const dayOfWeek = format(date, 'EEEE').toLowerCase()
  const businessHours = servicesData.businessHours[dayOfWeek as keyof typeof servicesData.businessHours]
  
  if (businessHours.closed) {
    return []
  }

  const slots: TimeSlot[] = []
  const [openHour, openMinute] = businessHours.open.split(':').map(Number)
  const [closeHour, closeMinute] = businessHours.close.split(':').map(Number)
  
  let currentTime = new Date(date)
  currentTime.setHours(openHour, openMinute, 0, 0)
  
  const closeTime = new Date(date)
  closeTime.setHours(closeHour, closeMinute, 0, 0)
  
  // Get settings
  const settings = servicesData.settings
  
  // Filter bookings to only those on the selected date
  const todaysBookings = existingBookings.filter(booking => 
    isSameDay(booking.appointmentDate, date)
  )
  
  // Calculate total duration for the services being booked (in minutes)
  const requestedDuration = calculateTotalDuration(selectedServiceIds, selectedAddons)
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('Time slot generation debug:', {
      selectedDate: format(date, 'yyyy-MM-dd'),
      dayOfWeek,
      businessHours,
      totalExistingBookings: existingBookings.length,
      todaysBookingsCount: todaysBookings.length,
      todaysBookings: todaysBookings.map(b => ({
        id: b.id,
        date: format(b.appointmentDate, 'yyyy-MM-dd'),
        time: `${b.startTime}-${b.endTime}`
      })),
      requestedDuration,
      selectedServiceIds
    })
  }
  
  // Generate slots every 30 minutes
  while (isBefore(currentTime, closeTime)) {
    const timeString = format(currentTime, 'HH:mm')
    let isAvailable = true
    let conflictingBooking: Booking | undefined
    
    // ONLY CHECK FOR ACTUAL BOOKING CONFLICTS
    if (requestedDuration > 0) {
      // If services are selected, check if the full service duration would conflict
      const serviceEndTime = addMinutes(currentTime, requestedDuration)
      
      // Only block if service would end after business hours
      if (isAfter(serviceEndTime, closeTime)) {
        isAvailable = false
      } else {
        // Check for conflicts with existing bookings on this day
        conflictingBooking = todaysBookings.find(booking => {
          const bookingStart = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.startTime}`)
          const bookingEnd = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.endTime}`)
          
          // Check if our proposed service time would overlap with this booking
          // Overlap occurs if: our start < their end AND our end > their start
          return (
            isBefore(currentTime, bookingEnd) && isAfter(serviceEndTime, bookingStart)
          )
        })
        
        if (conflictingBooking) {
          isAvailable = false
        }
      }
    } else {
      // If no services selected, only block if this exact slot is within an existing booking
      conflictingBooking = todaysBookings.find(booking => {
        const bookingStart = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.startTime}`)
        const bookingEnd = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.endTime}`)
        
        // Check if this specific 30-minute slot falls within an existing booking
        return (
          (isAfter(currentTime, bookingStart) || currentTime.getTime() === bookingStart.getTime()) &&
          isBefore(currentTime, bookingEnd)
        )
      })
      
      if (conflictingBooking) {
        isAvailable = false
      }
    }
    
    slots.push({
      time: timeString,
      available: isAvailable,
      bookingId: conflictingBooking?.id
    })
    
    currentTime = addMinutes(currentTime, 30) // 30-minute intervals
  }
  
  return slots
}

export function generateBookingId(): string {
  return `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function generateCustomerId(): string {
  return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}
