import { NextRequest, NextResponse } from 'next/server';
import { createCalendarEvent } from '@/lib/google-calendar';
import { Booking, BookingFormData } from '@/types';
import { 
  generateBookingId, 
  generateCustomerId, 
  calculateTotalPrice, 
  calculateTotalDuration,
  getServices 
} from '@/lib/utils';
import { format, addMinutes } from 'date-fns';

export async function POST(request: NextRequest) {
  try {
    const formData: BookingFormData = await request.json();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
        !formData.selectedServices.length || !formData.appointmentDate || !formData.selectedTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get services
    const services = getServices();
    const selectedServices = services.filter(service => 
      formData.selectedServices.includes(service.id)
    );

    if (selectedServices.length === 0) {
      return NextResponse.json({ error: 'Invalid services selected' }, { status: 400 });
    }

    // Calculate pricing and duration
    const totalPrice = calculateTotalPrice(formData.selectedServices);
    const totalDuration = calculateTotalDuration(formData.selectedServices);

    // Calculate end time
    const [hours, minutes] = formData.selectedTime.split(':').map(Number);
    const startTime = new Date(formData.appointmentDate);
    startTime.setHours(hours, minutes, 0, 0);
    const endTime = addMinutes(startTime, totalDuration);

    // Create booking object
    const booking: Booking = {
      id: generateBookingId(),
      customerId: generateCustomerId(),
      customer: {
        id: generateCustomerId(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date()
      },
      serviceIds: formData.selectedServices,
      services: selectedServices,
      appointmentDate: new Date(formData.appointmentDate),
      startTime: formData.selectedTime,
      endTime: format(endTime, 'HH:mm'),
      totalPrice,
      finalPrice: totalPrice,
      status: 'pending',
      notes: formData.notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create Google Calendar event
    try {
      const eventId = await createCalendarEvent(booking);
      if (eventId) {
        booking.googleCalendarEventId = eventId;
      }
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      // Continue with booking creation even if calendar fails
    }

    // In a real application, you would save this to a database
    // For now, we'll return the booking data to be saved in localStorage
    
    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking created successfully' 
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch bookings from a database
    // For now, return an empty array as bookings are stored in localStorage
    return NextResponse.json({ bookings: [] });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' }, 
      { status: 500 }
    );
  }
}
