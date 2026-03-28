import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, addMinutes, isBefore, isAfter, isSameDay } from 'date-fns'
import { Service, Booking, TimeSlot } from '@/types'

// Temporary local data as fallback
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

// Keep as synchronous for now to avoid breaking existing logic, 
// but we will prioritize fetching in components
export function getServices(): Service[] {
  return (servicesData.services || []) as Service[]
}

export function getServiceById(id: string, services?: Service[]): Service | undefined {
  const list = services || getServices()
  return list.find(service => service.id === id)
}

export function calculateTotalDuration(serviceIds: string[], selectedAddons: { [serviceId: string]: string[] } = {}, services?: Service[]): number {
  const list = services || getServices()
  const selectedServices = serviceIds.map(id => list.find(s => s.id === id)).filter(Boolean) as Service[]
  
  return selectedServices.reduce((total, service) => {
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

export function calculateTotalPrice(serviceIds: string[], selectedAddons: { [serviceId: string]: string[] } = {}, services?: Service[]): number {
  const list = services || getServices()
  const selectedServices = serviceIds.map(id => list.find(s => s.id === id)).filter(Boolean) as Service[]
  
  return selectedServices.reduce((total, service) => {
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
  totalDuration: number, 
  existingBookings: Booking[] = []
): TimeSlot[] {
  if (totalDuration === 0) return []
  
  // Business hours: 9 AM to 6 PM
  const startHour = 9
  const endHour = 18
  
  const slots: TimeSlot[] = []
  let currentSlot = new Date(date)
  currentSlot.setHours(startHour, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(endHour, 0, 0, 0)
  
  while (isBefore(currentSlot, endOfDay)) {
    const slotEndTime = addMinutes(currentSlot, totalDuration)
    
    // Check if slot ends before business hours end
    if (isAfter(slotEndTime, endOfDay)) break
    
    // Check if slot overlaps with any existing booking
    const isAvailable = !existingBookings.some(booking => {
      if (booking.status === 'cancelled') return false;

      const bookingDate = new Date(booking.appointmentDate)
      if (!isSameDay(currentSlot, bookingDate)) return false;

      // Parse startTime and endTime "HH:mm"
      const [startH, startM] = booking.startTime.split(':').map(Number)
      const [endH, endM] = booking.endTime.split(':').map(Number)
      
      const bookingStart = new Date(bookingDate)
      bookingStart.setHours(startH, startM, 0, 0)
      
      const bookingEnd = new Date(bookingDate)
      bookingEnd.setHours(endH, endM, 0, 0)
      
      return (
        (isBefore(currentSlot, bookingEnd) && isAfter(slotEndTime, bookingStart)) ||
        (currentSlot.getTime() === bookingStart.getTime())
      )
    })
    
    // Don't show past slots for today
    const now = new Date()
    const isPast = isSameDay(currentSlot, now) && isBefore(currentSlot, now)
    
    if (!isPast) {
      slots.push({
        time: format(currentSlot, 'HH:mm'),
        available: isAvailable
      })
    }
    
    // Move to next 30-min increment
    currentSlot = addMinutes(currentSlot, 30)
  }
  
  return slots
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone: string): boolean {
  const re = /^\+?[\d\s-]{10,}$/
  return re.test(phone)
}
