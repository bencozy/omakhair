export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'hair' | 'makeup' | 'combo';
  image?: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  customer: Customer;
  serviceIds: string[];
  services: Service[];
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  totalPrice: number;
  discountAmount?: number;
  finalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  googleCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  bookingId?: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  selectedServices: string[];
  appointmentDate: Date;
  selectedTime: string;
  notes?: string;
}

export interface AdminStats {
  totalBookings: number;
  todayBookings: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  popularServices: { service: Service; count: number }[];
}
