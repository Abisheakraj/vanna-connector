
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Database, Search, Table, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = heroRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      elements?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="min-h-screen pt-24 pb-16 flex flex-col justify-center relative overflow-hidden animated-bg"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[10%] -left-[5%] w-72 h-72 bg-vanna/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-[20%] -right-[10%] w-96 h-96 bg-vanna/10 rounded-full filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div 
            data-animate
            className="inline-block bg-vanna/10 text-vanna-dark px-4 py-1.5 rounded-full text-sm font-medium mb-8 opacity-0"
            style={{transitionDelay: '0.1s'}}
          >
            Simplify database queries with natural language
          </div>
          
          <h1 
            data-animate
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 opacity-0"
            style={{transitionDelay: '0.3s'}}
          >
            Connect, Explore, <span className="text-gradient">Query</span> Your Data <br /> with Natural Language
          </h1>
          
          <p 
            data-animate
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-0"
            style={{transitionDelay: '0.5s'}}
          >
            Vanna AI turns your questions into SQL, making database exploration accessible to everyone.
            Connect to any database and start querying with plain English.
          </p>
          
          <div 
            data-animate
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0"
            style={{transitionDelay: '0.7s'}}
          >
            <Button 
              size="lg" 
              className="rounded-full bg-vanna hover:bg-vanna-dark font-medium"
              asChild
            >
              <Link to="/database">
                Connect Database <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full font-medium"
            >
              View Demo
            </Button>
          </div>
          
          <div 
            data-animate
            className="relative max-w-4xl mx-auto opacity-0 shadow-2xl rounded-xl overflow-hidden"
            style={{transitionDelay: '0.9s'}}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none h-full w-full"></div>
            <div className="glass-effect rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">Vanna AI Query</div>
              </div>
              <div className="bg-black/80 text-white rounded-lg p-4 font-mono text-sm">
                <p className="text-green-400 mb-2">// Ask a question in plain English</p>
                <div className="flex items-start gap-2">
                  <span className="text-blue-400">$</span>
                  <div>
                    <p className="text-vanna-light mb-4">What are the top 5 customers by total order amount?</p>
                    <p className="text-yellow-300 mb-2">// Generated SQL</p>
                    <p className="text-gray-300">
                      SELECT c.customer_name, SUM(o.amount) as total_amount<br />
                      FROM customers c<br />
                      JOIN orders o ON c.customer_id = o.customer_id<br />
                      GROUP BY c.customer_name<br />
                      ORDER BY total_amount DESC<br />
                      LIMIT 5;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          data-animate
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 opacity-0"
          style={{transitionDelay: '1.1s'}}
        >
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-full bg-vanna/10 flex items-center justify-center mb-4">
              <Database className="text-vanna" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Any Database</h3>
            <p className="text-muted-foreground">
              Easily connect to PostgreSQL, MySQL, SQLite, and more with a simple configuration.
            </p>
          </div>
          
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-full bg-vanna/10 flex items-center justify-center mb-4">
              <Search className="text-vanna" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Natural Language Queries</h3>
            <p className="text-muted-foreground">
              Ask questions in plain English and get SQL queries and results instantly.
            </p>
          </div>
          
          <div className="glass-card p-6">
            <div className="w-12 h-12 rounded-full bg-vanna/10 flex items-center justify-center mb-4">
              <Table className="text-vanna" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visualize Results</h3>
            <p className="text-muted-foreground">
              Automatically generate visualizations from your query results to gain insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
