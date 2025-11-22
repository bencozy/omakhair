export interface ServiceAddon {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // additional time in minutes
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'hair' | 'braids' | 'sew-in' | 'combo';
  image?: string;
  requirements?: string[];
  includes?: string[];
  popular?: boolean;
  premium?: boolean;
  addons?: ServiceAddon[];
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
  paymentId?: string;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded' | 'partially_refunded';
  paidAmount?: number;
  refundAmount?: number;
  refundType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled' | 'refunded' | 'partially_refunded';
  stripeRefundId?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  metadata?: Record<string, any>;
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
  selectedAddons: { [serviceId: string]: string[] }; // serviceId -> addonIds[]
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
