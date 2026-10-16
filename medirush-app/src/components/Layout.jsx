import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* Responsive padding so content doesn't hide behind fixed top navbar or mobile bottom nav */}
      <main className="flex-grow pt-16 md:pt-24 pb-24 md:pb-8 w-full max-w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
