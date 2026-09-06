import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import Chatbot from './Chatbot'

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const firstName = user?.fullName.split(' ')[0] ?? user?.fullName

  return (
    <div className="layout">
      <header className="navbar">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          PenMart
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
          <Link to="/sell" onClick={closeMenu}>
            Sell a Pen
          </Link>
          <Link to="/my-listings" onClick={closeMenu}>
            My Listings
          </Link>
          <Link to="/profile" onClick={closeMenu}>
            Profile
          </Link>

          {isAuthenticated ? (
            <div className="navbar__auth">
              <Link to="/profile" className="navbar__user" onClick={closeMenu}>
                Hi, {firstName}
              </Link>
              <button
                type="button"
                className="navbar__logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="navbar__cta" onClick={closeMenu}>
              Login / Register
            </Link>
          )}
        </nav>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2026 PenMart. All rights reserved.</p>
      </footer>

      <Chatbot />
    </div>
  )
}
