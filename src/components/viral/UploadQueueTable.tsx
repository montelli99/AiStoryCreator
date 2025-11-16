"use client";

import { Badge } from "@/components/ui/badge";

export default function UploadQueueTable({ items }: any) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "processing":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "done":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="py-3 px-2 font-semibold">Video ID</th>
            <th className="py-3 px-2 font-semibold">Status</th>
            <th className="py-3 px-2 font-semibold">Mode</th>
            <th className="py-3 px-2 font-semibold">Attempts</th>
            <th className="py-3 px-2 font-semibold">Created</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item: any) => (
            <tr key={item.id} className="border-b hover:bg-muted/50 transition">
              <td className="py-3 px-2 font-mono text-xs">{item.videoId.slice(0, 8)}...</td>
              <td className="py-3 px-2">
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </td>
              <td className="py-3 px-2 capitalize">{item.mode}</td>
              <td className="py-3 px-2">{item.attempts}</td>
              <td className="py-3 px-2 text-xs">
                {new Date(item.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

