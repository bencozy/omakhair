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

export function calculateTotalDuration(serviceIds: string[]): number {
  const services = serviceIds.map(id => getServiceById(id)).filter(Boolean) as Service[]
  return services.reduce((total, service) => total + service.duration, 0)
}

export function calculateTotalPrice(serviceIds: string[]): number {
  const services = serviceIds.map(id => getServiceById(id)).filter(Boolean) as Service[]
  return services.reduce((total, service) => total + service.price, 0)
}

export function generateTimeSlots(date: Date, existingBookings: Booking[] = []): TimeSlot[] {
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
  
  // Generate slots every 2 hours (120 minutes)
  while (isBefore(currentTime, closeTime)) {
    const timeString = format(currentTime, 'HH:mm')
    
    // Check if this time slot conflicts with existing bookings
    const isBooked = existingBookings.some(booking => {
      if (!isSameDay(booking.appointmentDate, date)) return false
      
      const bookingStart = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.startTime}`)
      const bookingEnd = parseISO(`${format(date, 'yyyy-MM-dd')}T${booking.endTime}`)
      
      // Add 2-hour buffer (120 minutes) before and after each booking
      const bufferStart = addMinutes(bookingStart, -120)
      const bufferEnd = addMinutes(bookingEnd, 120)
      
      return (
        (isAfter(currentTime, bufferStart) && isBefore(currentTime, bookingEnd)) ||
        (isAfter(currentTime, bookingStart) && isBefore(currentTime, bufferEnd))
      )
    })
    
    slots.push({
      time: timeString,
      available: !isBooked,
      bookingId: isBooked ? existingBookings.find(b => 
        isSameDay(b.appointmentDate, date) && 
        b.startTime <= timeString && 
        b.endTime > timeString
      )?.id : undefined
    })
    
    currentTime = addMinutes(currentTime, 120) // 2 hours apart
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
