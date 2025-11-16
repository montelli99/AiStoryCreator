"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ViralSection from "@/components/viral/ViralSection";
import ViralGrid from "@/components/viral/ViralGrid";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAccounts() {
    try {
      const res = await fetch("/api/viral/accounts", { method: "GET" });
      const json = await res.json();
      setAccounts(json.data || []);
    } catch (err) {
      console.error("Account Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-xl">
        Loading Accounts...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">TikTok Accounts</h1>

        <Button className="flex items-center gap-2">
          <PlusCircle size={18} />
          Connect New Account
        </Button>
      </div>

      <ViralSection title="Connected Accounts">
        <ViralGrid>
          {accounts.map((acc: any) => (
            <Card key={acc.id} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{acc.username}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Followers: {acc.followers}
                </Badge>

                <div className="text-sm opacity-80">
                  Connected: {new Date(acc.createdAt).toLocaleDateString()}
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => loadAccounts()}
                >
                  Refresh
                </Button>
              </CardContent>
            </Card>
          ))}
        </ViralGrid>
      </ViralSection>
    </div>
  );
}

