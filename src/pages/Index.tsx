
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import DatabaseConnect from '@/components/DatabaseConnect';
import { Separator } from '@/components/ui/separator';

const Index = () => {
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
          </div>
        </section>
        
        <Separator />
        
        <section id="connect" className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Connect Your Database</h2>
              <p className="text-muted-foreground text-lg">
                Start exploring your data with natural language queries
              </p>
            </div>
            
            <DatabaseConnect />
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
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><ellipse cx="12" cy="6" rx="8" ry="3"></ellipse><path d="M4 6v6a8 3 0 0 0 16 0V6"></path><path d="M4 12v6a8 3 0 0 0 16 0v-6"></path></svg>,
    title: "Multiple Database Support",
    description: "Connect to PostgreSQL, MySQL, SQL Server, SQLite, and more with ease.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><path d="M17.5 22h.5c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M4 12v-2a2 2 0 0 1 2-2h2"></path><path d="M20 12v2a2 2 0 0 1-2 2h-2"></path><path d="M4 18c0-1.5.44-2 1.5-2.5S7.34 14 8 14s2.5.5 3.5 1 2 2 2 2"></path><path d="M10 20c-1.5 0-3 .5-3 2"></path><path d="M14 20c1.5 0 3 .5 3 2"></path><line x1="12" y1="15" x2="12" y2="20"></line></svg>,
    title: "Natural Language Queries",
    description: "Ask questions about your data in plain English and get instant answers.",
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vanna"><path d="M3 3v18h18"></path><path d="M18.4 7.2 18.7 7h.3"></path><path d="m8 11 2.45-2.45"></path><path d="m16 9-3.03 3.03"></path><path d="m6 15 2.45-2.45"></path><path d="m14 13-1.05 1.05"></path><path d="m10 16.5 1.7-1.7"></path><rect x="13" y="4" width="7" height="3" rx="1.5"></rect><circle cx="16.5" cy="15.5" r="2"></circle><path d="M16.5 10v3.5"></path></svg>,
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
