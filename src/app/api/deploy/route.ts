import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = process.env.DIGITALOCEAN_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: 'DigitalOcean token not configured' }, { status: 400 });
    }

    // App specification for DigitalOcean App Platform
    const appSpec = {
      name: "nextjs-pwa-app",
      region: "fra",
      services: [
        {
          name: "web",
          source_dir: "/",
          github: {
            repo: "your-username/your-repo-name", // You'll need to update this
            branch: "main"
          },
          run_command: "npm start",
          build_command: "npm run build",
          environment_slug: "node-js",
          instance_count: 1,
          instance_size_slug: "apps-s-1vcpu-0.5gb",
          http_port: 3000,
          routes: [
            {
              path: "/"
            }
          ],
          envs: [
            {
              key: "NODE_ENV",
              value: "production",
              type: "GENERAL"
            }
          ]
        }
      ],
      static_sites: [],
      jobs: [],
      workers: [],
      databases: []
    };

    console.log('Creating DigitalOcean App with spec:', JSON.stringify(appSpec, null, 2));

    const response = await fetch('https://api.digitalocean.com/v2/apps', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ spec: appSpec }),
    });

    const responseText = await response.text();
    console.log('DigitalOcean API Response:', responseText);

    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to create app',
        details: responseText,
        status: response.status 
      }, { status: response.status });
    }

    const data = JSON.parse(responseText);
    
    return NextResponse.json({ 
      success: true, 
      app: data.app,
      message: 'App deployment initiated successfully!'
    });

  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json({ 
      error: 'Deployment failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const token = process.env.DIGITALOCEAN_TOKEN;
    
    if (!token) {
      return NextResponse.json({ error: 'DigitalOcean token not configured' }, { status: 400 });
    }

    const response = await fetch('https://api.digitalocean.com/v2/apps', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ 
        error: 'Failed to fetch apps',
        details: errorText 
      }, { status: response.status });
    }

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      apps: data.apps || [],
      total: data.meta?.total || 0
    });

  } catch (error) {
    console.error('Error fetching apps:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch apps', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
