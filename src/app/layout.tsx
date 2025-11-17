'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';
import { startScheduler } from "@/lib/scheduler/automated-scheduler";
import { ThemeProvider } from "@/lib/theme/theme-context";
import ViewModeSwitcher from "@/components/global/ViewModeSwitcher";
import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start scheduler when app loads
  useEffect(() => {
    try {
      startScheduler();
    } catch (error) {
      console.error('Scheduler failed to start:', error);
    }
  }, []);

  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <SessionProvider session={null}>
            {/* Navigation Bar */}
            <nav className="bg-slate-900 text-white p-4 border-b">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="text-xl font-bold">AI Creator Studio</div>
                <div className="flex gap-6 text-sm items-center">
                  <Link href="/dashboard" className="hover:text-blue-400">Dashboard</Link>
                  <Link href="/viral-dashboard" className="hover:text-blue-400">Viral Dashboard</Link>
                  <Link href="/creator-command-center" className="hover:text-blue-400">Video Factory</Link>
                  <Link href="/accounts" className="hover:text-blue-400">Accounts</Link>
                  <Link href="/split-tests" className="hover:text-blue-400">Split Tests</Link>
                  <div className="border-l border-slate-700 pl-6">
                    <ViewModeSwitcher />
                  </div>
                </div>
              </div>
            </nav>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}