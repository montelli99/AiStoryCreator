'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface ApiKey {
  id: string;
  key: string;
  label: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
  hasFullKey?: boolean;
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      fetchApiKeys();
    }
  }, [status, router]);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys');
      const data = await response.json();
      if (data.success) {
        setApiKeys(data.apiKeys || []);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/api-keys/create', {
        method: 'POST'
      });
      const data = await response.json();
      if (data.success) {
        setNewKey(data.apiKey);
        await fetchApiKeys(); // Refresh the list
      }
    } catch (error) {
      console.error('Error creating API key:', error);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const updateApiKey = async (keyId: string, updates: { label?: string; isActive?: boolean }) => {
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      if (data.success) {
        await fetchApiKeys(); // Refresh the list
        setEditingKey(null);
        setNewLabel('');
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        await fetchApiKeys(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
            <p className="text-muted-foreground">
              Manage your API keys for accessing AI Creator Studio services
            </p>
          </div>
          
          <Dialog open={!!newKey} onOpenChange={(open) => !open && setNewKey(null)}>
            <DialogTrigger asChild>
              <Button onClick={createApiKey} disabled={creating} className="gap-2">
                <Plus className="w-4 h-4" />
                {creating ? 'Creating...' : 'Create API Key'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>API Key Created</DialogTitle>
                <DialogDescription>
                  Copy this API key now. You won't be able to see it again.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono break-all">
                      {showKey[newKey?.key || ''] ? newKey?.key : `${newKey?.key?.substring(0, 12)}...${newKey?.key?.substring(newKey.key.length - 4)}`}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        copyToClipboard(newKey?.key || '');
                        setShowKey({ ...showKey, [newKey?.key || '']: !showKey[newKey?.key || ''] });
                      }}
                    >
                      {showKey[newKey?.key || ''] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => copyToClipboard(newKey?.key || '')}
                    className="flex-1 gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Key
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* API Keys List */}
        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>
              These keys allow you to access AI Creator Studio APIs programmatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeys.length === 0 ? (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No API Keys Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first API key to start using the AI Creator Studio API.
                </p>
                <Button onClick={createApiKey} disabled={creating} className="gap-2">
                  <Plus className="w-4 h-4" />
                  {creating ? 'Creating...' : 'Create API Key'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-muted-foreground" />
                          {editingKey?.id === apiKey.id ? (
                            <Input
                              value={newLabel}
                              onChange={(e) => setNewLabel(e.target.value)}
                              className="h-7 w-48"
                              placeholder="Enter label"
                            />
                          ) : (
                            <span className="font-medium">{apiKey.label}</span>
                          )}
                          <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                            {apiKey.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {apiKey.key}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Created: {formatDate(apiKey.createdAt)}
                          </div>
                          {apiKey.lastUsedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Last used: {formatDate(apiKey.lastUsedAt)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingKey?.id === apiKey.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => updateApiKey(apiKey.id, { label: newLabel })}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingKey(null);
                                setNewLabel('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingKey(apiKey);
                                setNewLabel(apiKey.label);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateApiKey(apiKey.id, { isActive: !apiKey.isActive })}
                            >
                              {apiKey.isActive ? 'Disable' : 'Enable'}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteApiKey(apiKey.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Usage Info */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Keep your API keys secure and never share them publicly. 
            API keys have full access to your account and can be used to generate content, 
            view analytics, and manage your AI Creator Studio resources.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}