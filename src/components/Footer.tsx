import React from 'react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-gray-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="text-2xl font-bold text-black tracking-tight mb-4">
              Shoal AI
            </div>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              The world's first Consensus Engine. Truth, not summaries — for the
              decisions that cannot afford to be wrong.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-mono text-xs uppercase text-gray-500 tracking-widest mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Product
                  </Link>
                </li>
                <li>
                  <Link
                    to="/use-cases"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Use Cases
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase text-gray-500 tracking-widest mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/about"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase text-gray-500 tracking-widest mb-4">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-black hover:text-gray-500 transition-colors">
                    
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100">
          <p className="font-mono text-xs text-gray-500 tracking-wider">
            © 2026 SHOAL AI, INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>);

}