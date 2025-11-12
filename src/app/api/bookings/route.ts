import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to create booking' },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      booking: data,
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
    const token = request.headers.get('authorization');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(`${API_URL}/bookings`, {
      headers,
    });
    const bookings = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: bookings.message || 'Failed to fetch bookings' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' }, 
      { status: 500 }
    );
  }
}
