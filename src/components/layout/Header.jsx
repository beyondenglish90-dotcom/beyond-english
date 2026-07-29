import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, User, ShieldCheck } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'
import LanguageToggle from './LanguageToggle'
import Button from '../common/Button'

const NAV_ITEMS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/about', key: 'nav.about' },
  { to: '/curriculum', key: 'nav.curriculum' },
  { to: '/pricing', key: 'nav.pricing' },
  { to: '/resources', key: 'nav.resources' },
  { to: '/notices', key: 'nav.notices' },
]

export default function Header() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const navLinkStyle = ({ isActive }) => ({
    fontWeight: 600,
    fontSize: 15,
    color: isActive ? 'var(--primary)' : 'var(--text)',
  })

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: 'var(--header-height)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={() => setOpen(false)}>
          <img src="/Logo.png" alt="Beyond English" style={{ height: 36, width: 'auto' }} />
        </Link>

        <nav
          aria-label="Main"
          style={{ display: 'flex', gap: 28 }}
          className="header-nav-desktop"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} style={navLinkStyle}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="header-actions-desktop">
          <LanguageToggle />
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button as="link" to="/admin" size="sm" variant="ghost">
                  <ShieldCheck className="icon" style={{ width: 16, height: 16 }} />
                  {t('auth.admin')}
                </Button>
              )}
              <Button as="link" to="/mypage" size="sm" variant="outline">
                <User className="icon" style={{ width: 16, height: 16 }} />
                {user.name}
              </Button>
            </>
          ) : (
            <>
              <Button as="link" to="/login" size="sm" variant="ghost">
                {t('auth.login')}
              </Button>
              <Button as="link" to="/signup" size="sm">
                {t('auth.signup')}
              </Button>
            </>
          )}
        </div>

        <button
          className="header-menu-btn"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none' }}
        >
          {open ? <X className="icon" /> : <Menu className="icon" />}
        </button>
      </div>

      {open && (
        <div
          className="header-mobile-drawer"
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--surface)',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} style={navLinkStyle} onClick={() => setOpen(false)}>
              {t(item.key)}
            </NavLink>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
            <LanguageToggle />
          </div>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button as="link" to="/admin" variant="ghost" onClick={() => setOpen(false)}>
                  <ShieldCheck className="icon" style={{ width: 16, height: 16 }} />
                  {t('auth.admin')}
                </Button>
              )}
              <Button as="link" to="/mypage" variant="outline" onClick={() => setOpen(false)}>
                {user.name}
              </Button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 12 }}>
              <Button as="link" to="/login" variant="ghost" className="btn-block" onClick={() => setOpen(false)}>
                {t('auth.login')}
              </Button>
              <Button as="link" to="/signup" className="btn-block" onClick={() => setOpen(false)}>
                {t('auth.signup')}
              </Button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .header-nav-desktop, .header-actions-desktop { display: none !important; }
          .header-menu-btn { display: block !important; }
        }
      `}</style>
    </header>
  )
}
