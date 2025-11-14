import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    let endpoint = '';
    if (action === 'create-intent') {
      endpoint = '/payments/create-payment-intent';
    } else if (action === 'confirm') {
      endpoint = '/payments/confirm-payment';
    } else if (action === 'refund') {
      endpoint = '/payments/refund';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (action === 'refund') {
      const token = request.headers.get('authorization');
      if (token) {
        headers['Authorization'] = token;
      }
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Payment operation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      ...result
    });

  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Payment operation failed' }, 
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    const token = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    const response = await fetch(`${API_URL}/payments/booking/${bookingId}`, {
      headers,
    });
    
    const payment = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: payment.message || 'Failed to fetch payment' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ payment });
  } catch (error) {
    console.error('Failed to fetch payment:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment' }, 
      { status: 500 }
    );
  }
}

