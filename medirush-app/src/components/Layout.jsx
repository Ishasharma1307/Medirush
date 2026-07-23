import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      {/* pt-24 provides padding so content doesn't hide behind the fixed navbar */}
      <main className="flex-grow pt-24">
        <Outlet />
      </main>
    </div>
  );
};
