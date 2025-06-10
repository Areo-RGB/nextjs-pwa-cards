import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.DIGITALOCEAN_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: 'DigitalOcean token not configured' }, { status: 400 });
    }

    // Get account info
    const response = await fetch('https://api.digitalocean.com/v2/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Failed to fetch account info',
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      account: data.account
    });

  } catch (error) {
    console.error('Error fetching account:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch account info', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
