import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { Button } from './Button';
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navLinks = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Product',
    path: '/product'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'Use Cases',
    path: '/use-cases'
  }];

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-axiom text-white flex items-center justify-center text-xs font-bold">
              S
            </span>
            <span className="text-lg font-bold text-black tracking-tight">
              Shoal AI
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) =>
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
              `text-sm font-medium transition-colors ${isActive ? 'text-axiom' : 'text-black hover:text-gray-500'}`
              }>
              
                {link.name}
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/sign-in"
              className="text-sm font-medium text-black hover:text-gray-500 transition-colors">
              
              Sign In
            </Link>
            <Button variant="primary" href="/sign-up">
              Get Started
            </Button>
          </div>

          <button
            className="md:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu">
            
            {mobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>

        {mobileMenuOpen &&
        <div className="md:hidden mt-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
            {navLinks.map((link) =>
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/'}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
            `block text-sm font-medium transition-colors ${isActive ? 'text-axiom' : 'text-black'}`
            }>
            
                {link.name}
              </NavLink>
          )}
            <Link
            to="/sign-in"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-black">
            
              Sign In
            </Link>
            <Button variant="primary" href="/sign-up" fullWidth>
              Get Started
            </Button>
          </div>
        }
      </div>
    </nav>);

}