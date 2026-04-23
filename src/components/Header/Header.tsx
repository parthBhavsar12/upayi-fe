import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Logo } from '../Branding/Branding';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSignIn = location.pathname === '/signin';
  const isSignUp = location.pathname === '/signup';

  return (
    <header className="global-header">
      <div className="global-header__container">
        <Link to="/" className="global-header__logo">
          <Logo />
        </Link>
        <nav className="global-header__nav">
          {isAuthenticated ? (
            <div className="header-auth-section">
              <div className="header-nav-links">
                <NavLink
                  to="/transactions"
                  className={`nav-link ${location.pathname === '/transactions' ? 'nav-link--primary' : ''}`}
                >
                  Transactions
                </NavLink>
              </div>
              {user && (
                <Link to="/profile" className="header-user-profile" style={{ textDecoration: 'none' }}>
                  <div className="header-user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="header-user-info">
                    <span className="header-user-name">{user.name}</span>
                    <span className="header-user-email">{user.email}</span>
                  </div>
                </Link>
              )}
              <button className="nav-link nav-link--primary" onClick={logout}>
                Sign Out
              </button>

              {/* Mobile Menu Button */}
              <button 
                className="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
              </button>

              {/* Mobile Menu */}
              <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <NavLink
                  to="/transactions"
                  className="mobile-menu-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Transactions
                </NavLink>
                <button 
                  className="mobile-menu-link mobile-menu-signout"
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <NavLink
                to="/signin"
                className={`nav-link ${isSignIn ? 'nav-link--primary' : ''}`}
              >
                Sign In
              </NavLink>
              <NavLink
                to="/signup"
                className={`nav-link ${isSignUp ? 'nav-link--primary' : ''}`}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
