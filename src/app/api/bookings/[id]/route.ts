import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization');
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, { headers });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = await response.json();
    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const token = request.headers.get('authorization');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: response.status }
      );
    }

    const booking = await response.json();
    return NextResponse.json({ booking });
  } catch (error) {
    console.error('Failed to update booking:', error);
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
    const token = request.headers.get('authorization');
    
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(`${API_URL}/bookings/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}
