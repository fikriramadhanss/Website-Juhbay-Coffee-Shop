import { useState, useEffect } from 'react'
import { Menu, X, Coffee, ShoppingBag, Sun, Moon } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useTheme } from '../contexts/ThemeContext'

const navLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Cerita Kami', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Kontak', href: '#contact' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toggleCart, totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    if (window.location.pathname !== '/') {
      window.location.href = '/' + href
      return
    }
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-cream/95 dark:bg-dark-bg/95 backdrop-blur-md shadow-sm border-b border-stone-200 dark:border-dark-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group" aria-label="Beranda Juhbay Coffee">
            <Coffee size={22} className="text-terracotta transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-2xl font-semibold text-espresso dark:text-dark-text tracking-tight">
              Juhbay
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi Utama">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium text-espresso/70 dark:text-dark-muted hover:text-terracotta transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-terracotta transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 text-espresso/70 dark:text-dark-muted hover:text-terracotta transition-colors" aria-label="Toggle tema">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={toggleCart} className="relative p-2.5 text-espresso/70 dark:text-dark-muted hover:text-terracotta transition-colors" aria-label="Keranjang">
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-terracotta text-cream text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <a
              href="#contact"
              id="navbar-order-online-btn"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="px-5 py-2.5 bg-terracotta text-cream text-sm font-medium rounded-full hover:bg-espresso transition-colors duration-300 shadow-sm"
            >
              Pesan Online
            </a>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 text-espresso dark:text-dark-text" aria-label="Toggle tema">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={toggleCart} className="relative p-2 text-espresso dark:text-dark-text" aria-label="Keranjang">
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-cream text-[10px] font-bold rounded-full flex items-center justify-center">{totalItems}</span>}
            </button>
            <button
              id="navbar-mobile-toggle"
              className="p-2 text-espresso dark:text-dark-text"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu navigasi"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-cream/98 dark:bg-dark-surface/98 border-t border-stone-200 dark:border-dark-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-espresso/70 dark:text-dark-muted hover:text-terracotta transition-colors py-1"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="mt-2 text-center px-5 py-2.5 bg-terracotta text-cream text-sm font-medium rounded-full hover:bg-espresso transition-colors"
          >
            Pesan Online
          </a>
        </nav>
      </div>
    </header>
  )
}
