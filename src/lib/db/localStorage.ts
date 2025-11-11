/**
 * LocalStorage Database Implementation
 * 
 * This is a temporary implementation for development/demo purposes.
 * Replace this with a real database implementation for production.
 */

import { DatabaseService } from './interface';
import { Booking, Customer } from '@/types';
import { generateBookingId, generateCustomerId } from '@/lib/utils';

const BOOKINGS_KEY = 'bookings';
const CUSTOMERS_KEY = 'customers';

export class LocalStorageDB implements DatabaseService {
  // Helper methods for localStorage access
  private getBookings(): Booking[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(BOOKINGS_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((booking: any) => ({
      ...booking,
      appointmentDate: new Date(booking.appointmentDate),
      createdAt: new Date(booking.createdAt),
      updatedAt: new Date(booking.updatedAt),
      customer: {
        ...booking.customer,
        createdAt: new Date(booking.customer.createdAt)
      }
    }));
  }

  private saveBookings(bookings: Booking[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }

  private getCustomers(): Customer[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CUSTOMERS_KEY);
    if (!data) return [];
    
    return JSON.parse(data).map((customer: any) => ({
      ...customer,
      createdAt: new Date(customer.createdAt)
    }));
  }

  private saveCustomers(customers: Customer[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  // Booking Operations
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const bookings = this.getBookings();
    const now = new Date();
    
    const booking: Booking = {
      ...bookingData,
      id: generateBookingId(),
      createdAt: now,
      updatedAt: now
    };
    
    bookings.push(booking);
    this.saveBookings(bookings);
    
    return booking;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const bookings = this.getBookings();
    return bookings.find(b => b.id === id) || null;
  }

  async getAllBookings(): Promise<Booking[]> {
    return this.getBookings();
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const bookings = this.getBookings();
    return bookings.filter(b => 
      b.appointmentDate >= startDate && b.appointmentDate <= endDate
    );
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    const bookings = this.getBookings();
    return bookings.filter(b => b.customerId === customerId);
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const bookings = this.getBookings();
    const index = bookings.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    bookings[index] = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveBookings(bookings);
    return bookings[index];
  }

  async deleteBooking(id: string): Promise<boolean> {
    const bookings = this.getBookings();
    const filtered = bookings.filter(b => b.id !== id);
    
    if (filtered.length === bookings.length) {
      return false; // Booking not found
    }
    
    this.saveBookings(filtered);
    return true;
  }

  // Customer Operations
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const customers = this.getCustomers();
    
    const customer: Customer = {
      ...customerData,
      id: generateCustomerId(),
      createdAt: new Date()
    };
    
    customers.push(customer);
    this.saveCustomers(customers);
    
    return customer;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const customers = this.getCustomers();
    return customers.find(c => c.id === id) || null;
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const customers = this.getCustomers();
    return customers.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const customers = this.getCustomers();
    return customers.find(c => c.phone === phone) || null;
  }

  async getAllCustomers(): Promise<Customer[]> {
    return this.getCustomers();
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new Error(`Customer with id ${id} not found`);
    }
    
    customers[index] = {
      ...customers[index],
      ...updates
    };
    
    this.saveCustomers(customers);
    return customers[index];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    
    if (filtered.length === customers.length) {
      return false; // Customer not found
    }
    
    this.saveCustomers(filtered);
    return true;
  }

  // Utility Operations
  async healthCheck(): Promise<boolean> {
    try {
      // Test localStorage access
      if (typeof window === 'undefined') return false;
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const db = new LocalStorageDB();

