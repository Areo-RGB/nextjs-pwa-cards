'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface App {
  id: string;
  spec: {
    name: string;
    region: string;
  };
  created_at: string;
  updated_at: string;
  live_url?: string;
  active_deployment?: {
    phase: string;
    progress: {
      pending_steps: number;
      running_steps: number;
      success_steps: number;
      error_steps: number;
      total_steps: number;
    };
  };
}

export default function DigitalOceanDeployment() {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apps, setApps] = useState<App[]>([]);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deploy');
      const data = await response.json();
      
      if (data.success) {
        setApps(data.apps);
      } else {
        setError(data.error || 'Failed to fetch apps');
      }
    } catch (err) {
      setError('Network error while fetching apps');
      console.error('Fetch apps error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deployApp = async () => {
    setIsDeploying(true);
    setError(null);
    setDeploymentResult(null);
    
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setDeploymentResult(data);
        // Refresh apps list
        await fetchApps();
      } else {
        setError(data.error || 'Deployment failed');
      }
    } catch (err) {
      setError('Network error during deployment');
      console.error('Deployment error:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const getStatusBadge = (app: App) => {
    const phase = app.active_deployment?.phase || 'unknown';
    const variant = phase === 'ACTIVE' ? 'default' : 
                   phase === 'DEPLOYING' ? 'secondary' : 
                   phase === 'ERROR' ? 'destructive' : 'outline';
    
    return (
      <Badge variant={variant as any} className="text-xs">
        {phase}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🚀 Deploy to DigitalOcean</span>
          <Button 
            onClick={fetchApps} 
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? '⟳' : '🔄'} Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {deploymentResult && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✅ {deploymentResult.message}
            </p>
            {deploymentResult.app?.live_url && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                URL: <a href={deploymentResult.app.live_url} target="_blank" rel="noopener noreferrer" className="underline">
                  {deploymentResult.app.live_url}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="grid gap-3">
          <h3 className="text-sm font-medium">Current Apps:</h3>
          {apps.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No apps found. Deploy your first app!
            </p>
          ) : (
            apps.map((app) => (
              <div key={app.id} className="p-3 border rounded-md bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{app.spec.name}</span>
                  {getStatusBadge(app)}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <p>Region: {app.spec.region}</p>
                  <p>Created: {new Date(app.created_at).toLocaleDateString()}</p>
                  {app.live_url && (
                    <p>
                      URL: <a href={app.live_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline">
                        {app.live_url}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          onClick={deployApp} 
          disabled={isDeploying}
          className="flex-1"
        >
          {isDeploying ? '🚀 Deploying...' : '🚀 Deploy New App'}
        </Button>
      </CardFooter>
    </Card>
  );
}
