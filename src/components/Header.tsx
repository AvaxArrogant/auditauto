import React, { useState } from 'react';
import { Search, Menu, X, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  isAdminUser: boolean;
  onSignIn: () => void;
  onSignUp: () => void;
  onSignOut: () => void;
  user?: { name: string; email: string } | null;
  isAdminUser?: boolean;
}

export default function Header({ isAuthenticated, onSignIn, onSignUp, onSignOut, user, isAdminUser = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img src="/Asset 4.png" alt="AutoAudit" className="h-10" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/vehicle-history" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/vehicle-history') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Vehicle Checks
            </Link>
            <Link 
              to="/dispute-letters" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/dispute-letters') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Dispute Letters
            </Link>
            <Link 
              to="/pricing" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/pricing') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`transition-colors duration-200 font-medium ${
                    isActive('/dashboard') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className={`transition-colors duration-200 font-medium ${
                    isActive('/admin') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                  style={{ display: isAdminUser ? 'block' : 'none' }}
                >
                  Admin
                </Link>
                <Link 
                  to="/leaderboard" 
                  className={`transition-colors duration-200 font-medium ${
                    isActive('/leaderboard') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  Leaderboard
                </Link>
              </>
            )}
            <Link 
              to="/about" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/about') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`transition-colors duration-200 font-medium ${
                isActive('/contact') ? 'text-orange-600' : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 transition-colors duration-200"
                >
                  <User className="w-8 h-8 p-1 bg-gray-100 rounded-full" />
                  <span className="font-medium">{user?.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: isAdminUser ? 'block' : 'none' }}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/leaderboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Leaderboard
                    </Link>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={onSignIn}
                  className="text-gray-700 hover:text-orange-600 transition-colors duration-200 font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={onSignUp}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-all duration-200 transform hover:scale-105 font-medium shadow-md"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-2 space-y-2">
            <Link 
              to="/vehicle-history" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Vehicle History
            </Link>
            <Link 
              to="/dispute-letters" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Dispute Letters
            </Link>
            <Link 
              to="/pricing" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ display: isAdminUser ? 'block' : 'none' }}
                >
                  Admin
                </Link>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}
            <Link 
              to="/about" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <hr className="my-2" />
            {isAuthenticated ? (
              <button 
                onClick={() => {
                  onSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Sign Out
              </button>
            ) : (
              <>
                <button 
                  onClick={() => {
                    onSignIn();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    onSignUp();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 bg-orange-600 text-white rounded-md text-center hover:bg-orange-700"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}