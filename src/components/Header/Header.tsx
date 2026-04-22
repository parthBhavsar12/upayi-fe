import { NavLink, Link, useLocation } from 'react-router-dom';
import { Logo } from '../Branding/Branding';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

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
            <button className="nav-link nav-link--primary" onClick={logout}>
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
