# VIRAL ENGINE V3 — UI PAGES

---

## PAGE 1: Viral Dashboard

**File:** `src/app/viral-dashboard/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ViralDashboard() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch('/api/viral/insights');
        const data = await res.json();
        setInsights(data.insights || []);
      } catch (error) {
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Viral Intelligence Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time viral metrics and performance analytics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Watch Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.2%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Split Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : insights.length > 0 ? (
            <div className="space-y-2">
              {insights.map((insight: any) => (
                <div key={insight.id} className="p-2 border rounded">
                  <p className="font-medium">{insight.niche}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: {insight.trendScore}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No insights yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## PAGE 2: Accounts Manager

**File:** `src/app/accounts/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TikTok Accounts</h1>
        <p className="text-muted-foreground">
          Manage multiple TikTok pages and posting strategy
        </p>
      </div>

      <Button>+ Add Account</Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.length > 0 ? (
          accounts.map((account: any) => (
            <Card key={account.id}>
              <CardHeader>
                <CardTitle>{account.nickname}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connected: {new Date(account.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">No accounts connected</p>
        )}
      </div>
    </div>
  );
}
```

---

## PAGE 3: Split Testing

**File:** `src/app/split-tests/page.tsx`

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SplitTestsPage() {
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const res = await fetch('/api/viral/split-test');
      const data = await res.json();
      setTests(data.tests || []);
    };

    fetchTests();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Split Tests</h1>

      <div className="space-y-4">
        {tests.map((test: any) => (
          <Card key={test.id}>
            <CardHeader>
              <CardTitle className="text-lg">Test {test.id.slice(0, 8)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Variant A</p>
                  <p className="text-2xl font-bold">{test.performanceA.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Variant B</p>
                  <p className="text-2xl font-bold">{test.performanceB.toFixed(1)}%</p>
                </div>
              </div>
              {test.winner && (
                <p className="text-sm text-green-600">
                  Winner: Variant {test.winner}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

**CONTINUE TO:** `VIRAL_ENGINE_V3_COMPONENTS.md`

