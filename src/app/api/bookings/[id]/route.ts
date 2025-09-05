import { NextRequest, NextResponse } from 'next/server';
import { updateCalendarEvent, deleteCalendarEvent } from '@/lib/google-calendar';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    
    // In a real application, you would:
    // 1. Fetch the booking from database
    // 2. Update the booking
    // 3. Update the Google Calendar event if needed

    // For now, we'll just handle the calendar update
    if (updates.googleCalendarEventId && updates.booking) {
      try {
        await updateCalendarEvent(updates.googleCalendarEventId, updates.booking);
      } catch (error) {
        console.error('Failed to update calendar event:', error);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Booking updated successfully' 
    });

  } catch (error) {
    console.error('Booking update error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { googleCalendarEventId } = await request.json();
    
    // Delete from Google Calendar
    if (googleCalendarEventId) {
      try {
        await deleteCalendarEvent(googleCalendarEventId);
      } catch (error) {
        console.error('Failed to delete calendar event:', error);
      }
    }

    // In a real application, you would also delete from database

    return NextResponse.json({ 
      success: true, 
      message: 'Booking deleted successfully' 
    });

  } catch (error) {
    console.error('Booking deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' }, 
      { status: 500 }
    );
  }
}
