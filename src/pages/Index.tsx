
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Database, MessageSquare, BarChart3, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check if user has a saved database connection
  const hasDatabaseConnection = () => {
    const connection = localStorage.getItem('databaseConnection');
    return !!connection;
  };
  
  // Navigate based on connection and auth status
  const handleGetStarted = () => {
    if (!user) {
      navigate('/login');
    } else if (hasDatabaseConnection()) {
      navigate('/database/explore');
    } else {
      navigate('/database');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to interact with your database effortlessly
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card p-6 transition-all duration-300 hover:translate-y-[-5px]"
                >
                  <div className="w-12 h-12 rounded-full bg-vanna/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground text-lg">
                Get started with Vanna AI in just a few simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-vanna flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                className="bg-vanna hover:bg-vanna-dark text-white py-6 px-8 text-lg rounded-lg"
                onClick={handleGetStarted}
              >
                {!user ? (
                  <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In to Get Started
                  </>
                ) : hasDatabaseConnection() ? (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Continue to Explorer
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5" />
                    Connect Your Database
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
        
        <Separator />
        
        <section id="get-started" className="py-20 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Connect your database and start exploring your data with natural language queries
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!user ? (
                  <>
                    <Button
                      className="bg-vanna hover:bg-vanna-dark"
                      size="lg"
                      onClick={() => navigate('/login')}
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/signup')}
                    >
                      Create Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-vanna hover:bg-vanna-dark"
                      size="lg"
                      onClick={() => navigate('/database')}
                    >
                      <Database className="mr-2 h-5 w-5" />
                      Connect Database
                    </Button>
                    {hasDatabaseConnection() && (
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/database/explore')}
                      >
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Explore Data
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Features data
const features = [
  {
    icon: <Database className="h-6 w-6 text-vanna" />,
    title: "Multiple Database Support",
    description: "Connect to PostgreSQL, MySQL, SQL Server, SQLite, and more with ease.",
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-vanna" />,
    title: "Natural Language Queries",
    description: "Ask questions about your data in plain English and get instant answers.",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-vanna" />,
    title: "Interactive Visualizations",
    description: "Automatically generate charts and graphs from your query results.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18v-6"></path><path d="M8 18v-1"></path><path d="M16 18v-3"></path></svg>,
    title: "SQL Generation",
    description: "See the SQL code behind each query, perfect for learning and customization.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><rect x="2" y="5" width="20" height="14" rx="2"></rect><path d="M16 2v6"></path><path d="M8 2v6"></path><path d="M22 10H2"></path><path d="M7 15h0.01"></path><path d="M11 15h0.01"></path><path d="M15 15h0.01"></path></svg>,
    title: "Schema Explorer",
    description: "Browse tables, columns, and relationships within your database with ease.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path><path d="M19 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path></svg>,
    title: "Zero Setup",
    description: "No complex configuration or setup required. Just connect and start querying.",
  },
];

// How it works steps
const steps = [
  {
    title: "Connect Your Database",
    description: "Enter your database credentials to establish a secure connection.",
  },
  {
    title: "Ask Questions",
    description: "Type questions about your data in plain English and get instant results.",
  },
  {
    title: "Explore & Analyze",
    description: "View query results, generate visualizations, and gain insights from your data.",
  },
];

export default Index;
