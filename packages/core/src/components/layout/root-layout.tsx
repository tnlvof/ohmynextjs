import React from 'react';

export interface RootLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function RootLayout({ children, className }: RootLayoutProps) {
  return (
    <div className={`relative flex min-h-screen flex-col ${className || ''}`}>
      {children}
    </div>
  );
}
