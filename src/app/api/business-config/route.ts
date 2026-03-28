import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/business-config`, {
      cache: 'no-store',
    });
    const config = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: config.message || 'Failed to fetch business config' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ config });
  } catch (error) {
    console.error('Failed to fetch business config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business config' }, 
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    const response = await fetch(`${API_URL}/business-config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to update business config' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Update business config error:', error);
    return NextResponse.json(
      { error: 'Failed to update business config' }, 
      { status: 500 }
    );
  }
}
