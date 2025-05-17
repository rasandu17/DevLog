import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="text-xl font-bold text-white">DevLog</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
              Home
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/create" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Create Post
                </Link>
                <Link to="/profile" className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300">
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
              Home
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
                  Login
                </Link>
                <Link to="/register" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link to="/create" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
                  Create Post
                </Link>
                <Link to="/profile" className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800">
                  Profile
                </Link>
                <button 
                  onClick={logout}
                  className="text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
