import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="ml-[280px]">
        {/* Top bar */}
        <TopBar />

        {/* Main content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
