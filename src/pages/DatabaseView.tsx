
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatabaseExplorer from '@/components/DatabaseExplorer';

const DatabaseView = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has connected to a database
    const connectionString = localStorage.getItem('databaseConnection');
    if (!connectionString) {
      // Redirect to connection page if no database is connected
      navigate('/database');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <DatabaseExplorer />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DatabaseView;
