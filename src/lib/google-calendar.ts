import { google } from 'googleapis';
import { Booking } from '@/types';
import { addMinutes } from 'date-fns';

// Google Calendar configuration
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID!;
const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Initialize Google Calendar API
let calendar: ReturnType<typeof google.calendar> | null = null;

function initializeCalendar() {
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    console.warn('Google Calendar credentials not configured');
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    calendar = google.calendar({ version: 'v3', auth });
    return calendar;
  } catch (error) {
    console.error('Failed to initialize Google Calendar:', error);
    return null;
  }
}

export async function createCalendarEvent(booking: Booking): Promise<string | null> {
  try {
    const cal = calendar || initializeCalendar();
    if (!cal) {
      console.log('Google Calendar not configured, skipping event creation');
      return null;
    }

    const startDateTime = new Date(booking.appointmentDate);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    const totalDuration = booking.services.reduce((total, service) => total + service.duration, 0);
    const endDateTime = addMinutes(startDateTime, totalDuration);

    const event = {
      summary: `Hair Appointment - ${booking.customer.firstName} ${booking.customer.lastName}`,
      description: `
Services: ${booking.services.map(s => s.name).join(', ')}
Customer: ${booking.customer.firstName} ${booking.customer.lastName}
Email: ${booking.customer.email}
Phone: ${booking.customer.phone}
Total: $${booking.finalPrice}
${booking.notes ? `Notes: ${booking.notes}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/New_York', // Adjust timezone as needed
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
      attendees: [
        {
          email: booking.customer.email,
          displayName: `${booking.customer.firstName} ${booking.customer.lastName}`,
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    const response = await cal.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      resource: event,
      sendUpdates: 'all', // Send invitations to attendees
    });

    return response.data.id;
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    throw new Error('Failed to create calendar event');
  }
}

export async function updateCalendarEvent(eventId: string, booking: Booking): Promise<void> {
  try {
    const cal = calendar || initializeCalendar();
    if (!cal || !eventId) return;

    const startDateTime = new Date(booking.appointmentDate);
    const [hours, minutes] = booking.startTime.split(':').map(Number);
    startDateTime.setHours(hours, minutes, 0, 0);

    const totalDuration = booking.services.reduce((total, service) => total + service.duration, 0);
    const endDateTime = addMinutes(startDateTime, totalDuration);

    const event = {
      summary: `Hair Appointment - ${booking.customer.firstName} ${booking.customer.lastName}`,
      description: `
Services: ${booking.services.map(s => s.name).join(', ')}
Customer: ${booking.customer.firstName} ${booking.customer.lastName}
Email: ${booking.customer.email}
Phone: ${booking.customer.phone}
Total: $${booking.finalPrice}
Status: ${booking.status.toUpperCase()}
${booking.notes ? `Notes: ${booking.notes}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/New_York',
      },
    };

    await cal.events.update({
      calendarId: GOOGLE_CALENDAR_ID,
      eventId: eventId,
      resource: event,
      sendUpdates: 'all',
    });
  } catch (error) {
    console.error('Failed to update calendar event:', error);
    throw new Error('Failed to update calendar event');
  }
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  try {
    const cal = calendar || initializeCalendar();
    if (!cal || !eventId) return;

    await cal.events.delete({
      calendarId: GOOGLE_CALENDAR_ID,
      eventId: eventId,
      sendUpdates: 'all',
    });
  } catch (error) {
    console.error('Failed to delete calendar event:', error);
    throw new Error('Failed to delete calendar event');
  }
}

export async function getCalendarEvents(startDate: Date, endDate: Date) {
  try {
    const cal = calendar || initializeCalendar();
    if (!cal) return [];

    const response = await cal.events.list({
      calendarId: GOOGLE_CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    return response.data.items || [];
  } catch (error) {
    console.error('Failed to get calendar events:', error);
    return [];
  }
}
