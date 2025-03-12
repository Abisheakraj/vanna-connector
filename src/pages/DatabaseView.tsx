
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NaturalLanguageQuery from '@/components/NaturalLanguageQuery';
import QueryResults from '@/components/QueryResults';
import SchemaExplorer from '@/components/SchemaExplorer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ConnectionConfig, 
  getDatabaseTables, 
  getConnectionConfig 
} from '@/services/database';
import { useQuery } from '@tanstack/react-query';

const DatabaseView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connectionConfig, setConnectionConfig] = useState<ConnectionConfig | null>(null);
  const [queryResult, setQueryResult] = useState<{ columns: string[], rows: any[] } | null>(null);
  
  // Check for database connection
  useEffect(() => {
    const loadConnection = async () => {
      try {
        // First check localStorage for faster loading
        const localConnection = localStorage.getItem('databaseConnection');
        if (localConnection) {
          const config = JSON.parse(localConnection);
          setConnectionConfig(config);
        }
        
        // Then try to get from Supabase (will override localStorage if exists)
        const config = await getConnectionConfig();
        if (config) {
          setConnectionConfig(config);
        } else if (!localConnection) {
          // If no connection in Supabase or localStorage, redirect
          toast({
            title: "No database connected",
            description: "Please connect to a database first",
          });
          navigate('/database');
        }
      } catch (error) {
        console.error('Error loading connection:', error);
      }
    };
    
    loadConnection();
  }, [navigate, user]);

  // Query to fetch database tables
  const { data: tables = [] } = useQuery({
    queryKey: ['databaseTables', connectionConfig?.database],
    queryFn: () => connectionConfig ? getDatabaseTables(connectionConfig) : Promise.resolve([]),
    enabled: !!connectionConfig,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleQueryResult = (result: { columns: string[], rows: any[] }) => {
    setQueryResult(result);
  };

  // If no connection config is loaded yet, show loading
  if (!connectionConfig) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vanna mx-auto"></div>
            <p className="mt-4 text-lg">Loading database connection...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Database Explorer</h1>
            <p className="text-muted-foreground">
              Connected to <span className="font-medium">{connectionConfig.database}</span> on <span className="font-medium">{connectionConfig.host}</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <NaturalLanguageQuery 
                connectionConfig={connectionConfig} 
                tables={tables}
                onQueryResult={handleQueryResult}
              />
              
              {queryResult && (
                <QueryResults columns={queryResult.columns} rows={queryResult.rows} />
              )}
            </div>
            
            <div className="lg:col-span-1">
              <SchemaExplorer tables={tables} />
            </div>
          </div>
        </div>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default DatabaseView;
