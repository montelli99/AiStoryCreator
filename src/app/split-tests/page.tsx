"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViralSection from "@/components/viral/ViralSection";
import ViralGrid from "@/components/viral/ViralGrid";

export default function SplitTestsPage() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTests() {
    try {
      const res = await fetch("/api/viral/split-test", { method: "GET" });
      const json = await res.json();
      setTests(json.data || []);
    } catch (err) {
      console.error("Split Test Load Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTests();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-xl">
        Loading Split Tests...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-4xl font-bold">Split Tests</h1>

      <ViralSection title="Active & Completed Tests">
        <ViralGrid>
          {tests.map((test: any) => {
            const winner =
              test.variantA_views > test.variantB_views
                ? "Variant A"
                : "Variant B";

            return (
              <Card key={test.id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Split Test #{test.id}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-md border bg-muted">
                      <div className="font-semibold mb-1">Variant A</div>
                      <div className="text-sm opacity-80">
                        Views: {test.variantA_views}
                      </div>
                    </div>

                    <div className="p-3 rounded-md border bg-muted">
                      <div className="font-semibold mb-1">Variant B</div>
                      <div className="text-sm opacity-80">
                        Views: {test.variantB_views}
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant="default"
                    className="px-3 py-1 text-sm"
                  >
                    Winner: {winner}
                  </Badge>

                  <Button
                    variant="outline"
                    onClick={() => loadTests()}
                    className="w-full"
                  >
                    Refresh
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </ViralGrid>
      </ViralSection>
    </div>
  );
}

