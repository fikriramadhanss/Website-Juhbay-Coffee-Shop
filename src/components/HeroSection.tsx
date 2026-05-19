import { ArrowDown } from 'lucide-react'
import { useSiteSettings } from '../lib/useSiteSettings'

export default function HeroSection() {
  const settings = useSiteSettings()

  const scrollToMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    document.querySelector('#menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cream dark:bg-dark-bg"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-terracotta/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-terracotta/8 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-stone-100/60 dark:bg-stone-800/20 blur-3xl" />
      </div>

      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-terracotta/30 bg-terracotta/5 mb-8 animate-fade-in-up">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
          <span className="text-xs font-medium text-terracotta tracking-widest uppercase">
            Pemanggang Kopi Artisan
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-espresso dark:text-dark-text leading-[1.08] tracking-tight mb-6 animate-fade-in-up animate-delay-100">
          Meracik Momen,
          <br />
          Setiap <em className="text-terracotta not-italic">Seduhan.</em>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-espresso/60 dark:text-dark-muted font-light max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
          {settings?.description || 'Biji kopi dari sumber berkelanjutan, dipanggang dengan sempurna dan disajikan langsung ke cangkir Anda.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap animate-fade-in-up animate-delay-300">
          <a
            href="#menu"
            id="hero-explore-menu-btn"
            onClick={scrollToMenu}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-espresso dark:bg-cream dark:text-espresso text-cream text-sm font-medium rounded-full hover:bg-terracotta dark:hover:bg-terracotta dark:hover:text-cream transition-colors duration-300 shadow-lg shadow-espresso/20"
          >
            Lihat Menu
            <ArrowDown size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
          <a
            href="#about"
            id="hero-our-story-btn"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 border border-espresso/20 dark:border-dark-border text-espresso dark:text-dark-text text-sm font-medium rounded-full hover:border-terracotta hover:text-terracotta transition-colors duration-300"
          >
            Cerita Kami
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <span className="text-xs text-espresso/30 dark:text-dark-muted/50 tracking-widest uppercase">Gulir</span>
          <div className="w-px h-8 bg-gradient-to-b from-espresso/20 dark:from-dark-muted/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}
