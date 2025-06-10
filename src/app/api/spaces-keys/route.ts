import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Key name is required' },
        { status: 400 }
      );
    }

    const token = process.env.DIGITALOCEAN_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'DigitalOcean token not configured' },
        { status: 500 }
      );
    }

    // Create Spaces access key using DigitalOcean API
    const response = await axios.post(
      'https://api.digitalocean.com/v2/spaces/keys',
      {
        name: name,
        // Optional: Add bucket access restrictions
        bucket_access: [
          {
            bucket: process.env.SPACES_BUCKET || 'data4',
            permissions: ['read', 'write', 'delete']
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const { access_key, secret_key } = response.data.key;

    return NextResponse.json({
      success: true,
      accessKey: access_key,
      secretKey: secret_key,
      bucket: process.env.SPACES_BUCKET,
      region: process.env.SPACES_REGION,
      endpoint: process.env.SPACES_ENDPOINT
    });  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error creating Spaces key:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to create Spaces access key',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Get existing Spaces keys
export async function GET() {
  try {
    const token = process.env.DIGITALOCEAN_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'DigitalOcean token not configured' },
        { status: 500 }
      );
    }

    const response = await axios.get(
      'https://api.digitalocean.com/v2/spaces/keys',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({
      success: true,
      keys: response.data.keys
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching Spaces keys:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Spaces keys',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
