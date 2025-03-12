
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, createContext } from 'react';

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DatabaseView from "./pages/DatabaseView";
import DatabaseConnectPage from "./pages/DatabaseConnectPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AuthProvider from "./contexts/AuthContext";

// Initialize Supabase client
export const supabaseUrl = 'https://zrsijnufxlrqgpytctae.supabase.co';
export const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyc2lqbnVmeGxycWdweXRjdGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NjA2MDcsImV4cCI6MjA1NzMzNjYwN30.jFkfKnRMT7NQsNb-aTEpkYcMmmPeCTAUZ6SUxf5HJhQ';
export const supabase = createClient(supabaseUrl, supabaseKey);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
  }, []);
  
  if (isAuthenticated === null) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/database" element={
              <ProtectedRoute>
                <DatabaseConnectPage />
              </ProtectedRoute>
            } />
            <Route path="/database/explore" element={
              <ProtectedRoute>
                <DatabaseView />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
