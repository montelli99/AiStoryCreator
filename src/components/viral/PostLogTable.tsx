"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

export default function PostLogTable({ logs }: any) {
  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <XCircle className="w-4 h-4 text-red-600" />
    );
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "auto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "draft":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b">
            <th className="py-3 px-2 font-semibold">Status</th>
            <th className="py-3 px-2 font-semibold">Video ID</th>
            <th className="py-3 px-2 font-semibold">Mode</th>
            <th className="py-3 px-2 font-semibold">Response</th>
            <th className="py-3 px-2 font-semibold">Timestamp</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log: any) => (
            <tr key={log.id} className="border-b hover:bg-muted/50 transition">
              <td className="py-3 px-2">
                {getStatusIcon(log.success)}
              </td>
              <td className="py-3 px-2 font-mono text-xs">{log.videoId.slice(0, 8)}...</td>
              <td className="py-3 px-2">
                <Badge className={getModeColor(log.mode)}>
                  {log.mode}
                </Badge>
              </td>
              <td className="py-3 px-2 text-xs max-w-xs truncate">
                {typeof log.response === "string"
                  ? log.response
                  : JSON.stringify(log.response).slice(0, 50)}
              </td>
              <td className="py-3 px-2 text-xs">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

