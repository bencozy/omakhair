/**
 * MongoDB Database Implementation (EXAMPLE)
 * 
 * To use this implementation:
 * 1. npm install mongodb
 * 2. Set MONGODB_URI in .env
 * 3. Rename this file to mongodb.ts
 * 4. Update src/lib/db/index.ts to import from './mongodb'
 */

import { MongoClient, Db, ObjectId } from 'mongodb';
import { DatabaseService } from './interface';
import { Booking, Customer } from '@/types';

let client: MongoClient | null = null;
let db: Db | null = null;

export class MongoDB implements DatabaseService {
  private async getDb(): Promise<Db> {
    if (db) return db;
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('oma-khair'); // Database name
    
    return db;
  }

  // Booking Operations
  async createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const database = await this.getDb();
    const now = new Date();
    
    const booking = {
      ...bookingData,
      createdAt: now,
      updatedAt: now
    };
    
    const result = await database.collection('bookings').insertOne(booking);
    
    return {
      ...booking,
      id: result.insertedId.toString()
    } as Booking;
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const database = await this.getDb();
    const booking = await database.collection('bookings').findOne({ _id: new ObjectId(id) });
    
    if (!booking) return null;
    
    return {
      ...booking,
      id: booking._id.toString()
    } as Booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    const database = await this.getDb();
    const bookings = await database.collection('bookings')
      .find()
      .sort({ appointmentDate: -1 })
      .toArray();
    
    return bookings.map(b => ({
      ...b,
      id: b._id.toString()
    })) as Booking[];
  }

  async getBookingsByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    const database = await this.getDb();
    const bookings = await database.collection('bookings')
      .find({
        appointmentDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ appointmentDate: 1 })
      .toArray();
    
    return bookings.map(b => ({
      ...b,
      id: b._id.toString()
    })) as Booking[];
  }

  async getBookingsByCustomerId(customerId: string): Promise<Booking[]> {
    const database = await this.getDb();
    const bookings = await database.collection('bookings')
      .find({ customerId })
      .sort({ appointmentDate: -1 })
      .toArray();
    
    return bookings.map(b => ({
      ...b,
      id: b._id.toString()
    })) as Booking[];
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
    const database = await this.getDb();
    
    const result = await database.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      throw new Error(`Booking with id ${id} not found`);
    }
    
    return {
      ...result,
      id: result._id.toString()
    } as Booking;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const database = await this.getDb();
    const result = await database.collection('bookings').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Customer Operations
  async createCustomer(customerData: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
    const database = await this.getDb();
    
    const customer = {
      ...customerData,
      createdAt: new Date()
    };
    
    const result = await database.collection('customers').insertOne(customer);
    
    return {
      ...customer,
      id: result.insertedId.toString()
    } as Customer;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const database = await this.getDb();
    const customer = await database.collection('customers').findOne({ _id: new ObjectId(id) });
    
    if (!customer) return null;
    
    return {
      ...customer,
      id: customer._id.toString()
    } as Customer;
  }

  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const database = await this.getDb();
    const customer = await database.collection('customers').findOne({ 
      email: { $regex: new RegExp(`^${email}$`, 'i') } 
    });
    
    if (!customer) return null;
    
    return {
      ...customer,
      id: customer._id.toString()
    } as Customer;
  }

  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    const database = await this.getDb();
    const customer = await database.collection('customers').findOne({ phone });
    
    if (!customer) return null;
    
    return {
      ...customer,
      id: customer._id.toString()
    } as Customer;
  }

  async getAllCustomers(): Promise<Customer[]> {
    const database = await this.getDb();
    const customers = await database.collection('customers')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    return customers.map(c => ({
      ...c,
      id: c._id.toString()
    })) as Customer[];
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const database = await this.getDb();
    
    const result = await database.collection('customers').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      throw new Error(`Customer with id ${id} not found`);
    }
    
    return {
      ...result,
      id: result._id.toString()
    } as Customer;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const database = await this.getDb();
    const result = await database.collection('customers').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Utility Operations
  async healthCheck(): Promise<boolean> {
    try {
      const database = await this.getDb();
      await database.admin().ping();
      return true;
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (client) {
      await client.close();
      client = null;
      db = null;
    }
  }
}

// Export singleton instance
export const db = new MongoDB();

