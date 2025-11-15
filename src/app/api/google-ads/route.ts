import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const token = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    let endpoint = '';
    if (action === 'campaigns') {
      endpoint = '/google-ads/campaigns';
    } else if (action === 'performance') {
      endpoint = `/google-ads/performance?startDate=${startDate}&endDate=${endDate}`;
    } else if (action === 'overview') {
      endpoint = '/google-ads/overview';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || 'Failed to fetch Google Ads data' },
        { status: response.status }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Google Ads API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Ads data' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    
    const token = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }

    let endpoint = '';
    let method = 'POST';

    if (action === 'create-campaign') {
      endpoint = '/google-ads/campaigns';
    } else if (action === 'update-status') {
      endpoint = `/google-ads/campaigns/${data.campaignId}/status`;
      method = 'PATCH';
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || 'Operation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      ...result
    });

  } catch (error) {
    console.error('Google Ads API error:', error);
    return NextResponse.json(
      { error: 'Operation failed' }, 
      { status: 500 }
    );
  }
}

