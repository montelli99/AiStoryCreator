'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function VariantSelector() {
  const [contentId, setContentId] = useState('');
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/viral/variants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId })
      });
      const data = await res.json();
      setVariants(data.variants || []);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Variants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Content ID</label>
          <input
            type="text"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
            placeholder="Enter content ID"
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Variants'}
        </Button>

        {variants.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {variants.map((v: any) => (
              <div key={v.id} className="p-2 border rounded text-center">
                <p className="font-medium text-sm">{v.variant}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

