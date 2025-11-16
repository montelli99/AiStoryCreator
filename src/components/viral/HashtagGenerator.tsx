'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function HashtagGenerator() {
  const [niche, setNiche] = useState('');
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/viral/hashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, topic })
      });
      const data = await res.json();
      setHashtags(data.hashtags);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hashtag Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Niche</label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="stoicism"
              className="w-full p-2 border rounded mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="discipline"
              className="w-full p-2 border rounded mt-1"
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Hashtags'}
        </Button>

        {hashtags && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Primary</p>
              <div className="flex flex-wrap gap-2">
                {(hashtags as any).primary?.map((tag: string) => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Velocity</p>
              <div className="flex flex-wrap gap-2">
                {(hashtags as any).velocity?.map((tag: string) => (
                  <span key={tag} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Low Competition</p>
              <div className="flex flex-wrap gap-2">
                {(hashtags as any).lowComp?.map((tag: string) => (
                  <span key={tag} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

