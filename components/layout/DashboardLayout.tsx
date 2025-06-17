import React from 'react';
import { DashboardHeader } from '@/components/client-components/layout/dashboard-header';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">

        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
