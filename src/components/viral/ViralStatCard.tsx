import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ViralStatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

