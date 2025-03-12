
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Database, Home } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 glass-effect' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-bold text-2xl transition-all duration-300"
          >
            <span className="w-8 h-8 rounded-lg bg-vanna flex items-center justify-center">
              <span className="text-white">V</span>
            </span>
            <span className="text-gradient">Vanna</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-medium hover:text-vanna transition-colors">
              Home
            </Link>
            <Link to="/#features" className="font-medium hover:text-vanna transition-colors">
              Features
            </Link>
            <Link to="/#how-it-works" className="font-medium hover:text-vanna transition-colors">
              How It Works
            </Link>
            <Link to="/database" className="font-medium hover:text-vanna transition-colors">
              Database
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="outline" className="rounded-full font-medium">
              Login
            </Button>
            <Button className="rounded-full font-medium bg-vanna hover:bg-vanna-dark">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 focus:outline-none" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-lg transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-end mb-8">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 focus:outline-none"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <nav className="flex flex-col gap-6 mt-8">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-xl font-medium" 
              onClick={toggleMobileMenu}
            >
              <Home size={20} />
              Home
            </Link>
            <Link 
              to="/#features" 
              className="flex items-center gap-3 text-xl font-medium" 
              onClick={toggleMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Features
            </Link>
            <Link 
              to="/#how-it-works" 
              className="flex items-center gap-3 text-xl font-medium" 
              onClick={toggleMobileMenu}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              How It Works
            </Link>
            <Link 
              to="/database" 
              className="flex items-center gap-3 text-xl font-medium" 
              onClick={toggleMobileMenu}
            >
              <Database size={20} />
              Database
            </Link>
          </nav>
          
          <div className="mt-auto flex flex-col gap-4">
            <Button variant="outline" className="w-full rounded-full font-medium">
              Login
            </Button>
            <Button className="w-full rounded-full font-medium bg-vanna hover:bg-vanna-dark">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
