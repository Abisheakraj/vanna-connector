
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DatabaseConnect from '@/components/DatabaseConnect';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const DatabaseConnectPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Connect Your Database</h2>
            <p className="text-muted-foreground text-lg">
              Start exploring your data with natural language queries
            </p>
            {user && (
              <p className="mt-2 text-sm text-muted-foreground">
                Logged in as: {user.email}
              </p>
            )}
          </div>
          
          <DatabaseConnect />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DatabaseConnectPage;
