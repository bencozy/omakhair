import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
    
    const response = await fetch(`${API_URL}/blocked-dates/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to delete blocked date');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blocked date:', error);
    return NextResponse.json(
      { error: 'Failed to delete blocked date' },
      { status: 500 }
    );
  }
}

