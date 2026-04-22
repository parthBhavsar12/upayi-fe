import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '../Branding/Branding';

export function Header() {
  const location = useLocation();
  const isSignIn = location.pathname === '/signin';
  const isSignUp = location.pathname === '/signup';
  const isHome = location.pathname === '/';

  return (
    <header className="global-header">
      <div className="global-header__container">
        <Link to="/" className="global-header__logo">
          <Logo />
        </Link>
        <nav className="global-header__nav">
          {isHome ? (
            <button className="nav-link nav-link--primary" onClick={() => window.location.href = '/signin'}>
              Sign Out
            </button>
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
