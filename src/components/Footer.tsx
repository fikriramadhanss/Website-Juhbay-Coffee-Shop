import { Coffee, Globe, MessageCircle, Mail } from 'lucide-react'
import { useSiteSettings } from '../lib/useSiteSettings'

const socials = [
  { icon: Globe, label: 'Website', href: '#' },
  { icon: MessageCircle, label: 'WhatsApp', href: '#' },
  { icon: Mail, label: 'Email', href: '#' },
]

const footerLinks = [
  { label: 'Beranda', href: '#home' },
  { label: 'Cerita Kami', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Kontak', href: '#contact' },
]

export default function Footer() {
  const settings = useSiteSettings()
  const year = new Date().getFullYear()
  const store_name = settings?.store_name || 'Juhbay Coffee'
  const description = settings?.description || ''
  const address = settings?.address || ''
  const email = settings?.email || ''
  const phone = settings?.phone || ''

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) return
    e.preventDefault()
    if (window.location.pathname !== '/') {
      window.location.href = '/' + href
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-espresso dark:bg-dark-surface text-cream/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 py-14 border-b border-cream/10 dark:border-dark-border">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Coffee size={20} className="text-terracotta" />
              <span className="font-serif text-2xl font-semibold text-cream">{store_name}</span>
            </div>
            <p className="text-sm leading-relaxed text-cream/50 max-w-xs">{description}</p>
            <div className="flex items-center gap-3 mt-6">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={label === 'Email' && email ? `mailto:${email}` : href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cream/10 flex items-center justify-center text-cream/40 hover:text-terracotta hover:border-terracotta/40 transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/40 mb-5">Tautan Cepat</h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="text-sm text-cream/60 hover:text-terracotta transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/40 mb-5">Jam Operasional</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between gap-4"><span className="text-cream/40">Senin – Minggu</span><span className="text-cream/70">10:00 – 23:00</span></li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream/40 mb-5">Temukan Kami</h4>
            <address className="not-italic text-sm text-cream/60 leading-relaxed whitespace-pre-line">
              {address}
            </address>
            {phone && <p className="mt-2 text-sm text-cream/60">{phone}</p>}
            {email && (
              <p className="mt-2 text-sm text-cream/60">
                <a href={`mailto:${email}`} className="hover:text-terracotta transition-colors">{email}</a>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-6 text-xs text-cream/30">
          <p>&copy; {year} {store_name}. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat dengan sepenuh hati di Jakarta, Indonesia.</p>
        </div>
      </div>
    </footer>
  )
}
