/**
 * Database Interface
 * 
 * This interface defines all database operations needed by the application.
 * Implement this interface with your chosen database solution (Supabase, MongoDB, PostgreSQL, etc.)
 */

import { Booking, Customer } from '@/types';

export interface DatabaseService {
  // Booking Operations
  createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  getAllBookings(): Promise<Booking[]>;
  getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;
  getBookingsByCustomerId(customerId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking>;
  deleteBooking(id: string): Promise<boolean>;
  
  // Customer Operations
  createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer>;
  getCustomerById(id: string): Promise<Customer | null>;
  getCustomerByEmail(email: string): Promise<Customer | null>;
  getCustomerByPhone(phone: string): Promise<Customer | null>;
  getAllCustomers(): Promise<Customer[]>;
  updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer>;
  deleteCustomer(id: string): Promise<boolean>;
  
  // Utility Operations
  healthCheck(): Promise<boolean>;
  disconnect?(): Promise<void>;
}

