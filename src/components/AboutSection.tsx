import { Leaf, Award, Heart } from 'lucide-react'
import { useSiteSettings } from '../lib/useSiteSettings'

const values = [
  {
    icon: Leaf,
    title: 'Perdagangan Langsung',
    description: 'Kami mengambil kopi langsung dari petani, memotong perantara dan memastikan kompensasi yang adil.',
  },
  {
    icon: Award,
    title: 'Asal Tunggal (Single Origin)',
    description: 'Setiap batch dapat dilacak hingga ke kebunnya — transparansi penuh dari tanah ke cangkir Anda.',
  },
  {
    icon: Heart,
    title: 'Batch Kecil',
    description: 'Dipanggang setiap minggu dalam porsi kecil untuk menjamin kesegaran dan kompleksitas rasa.',
  },
]

export default function AboutSection() {
  const settings = useSiteSettings()

  return (
    <section id="about" className="py-28 lg:py-36 bg-cream dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Image Block */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-200 dark:bg-dark-surface shadow-2xl shadow-espresso/10">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
                alt={`Persiapan kopi artisan di ${settings?.store_name || 'Juhbay Coffee'}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-espresso/10" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-terracotta text-cream rounded-2xl p-5 shadow-xl">
              <p className="font-serif text-3xl font-bold leading-none">1+</p>
              <p className="text-xs font-medium mt-1 text-cream/80 tracking-wide uppercase">Tahun Pengalaman</p>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-terracotta/20 rounded-xl -z-10" />
          </div>

          {/* Right — Text Block */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-terracotta mb-4">
              Asal Usul Kami
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-espresso dark:text-dark-text leading-tight mb-6 text-balance">
              Dari Pertanian Berkelanjutan ke Secangkir Kopi Pagi Anda
            </h2>
            {settings?.our_story ? (
              <p className="text-espresso/60 dark:text-dark-muted leading-relaxed mb-10 text-base whitespace-pre-line">{settings.our_story}</p>
            ) : (
              <>
                <p className="text-espresso/60 dark:text-dark-muted leading-relaxed mb-5 text-base">
                  {settings?.store_name || 'Juhbay'} lahir dari sebuah keyakinan sederhana: kopi yang luar biasa dimulai jauh sebelum dipanggang.
                  Kami bepergian ke dataran tinggi terpencil di seluruh Indonesia, Ethiopia, dan Kolombia,
                  menjalin hubungan langsung dengan petani kecil yang mempraktikkan pertanian regeneratif.
                </p>
                <p className="text-espresso/60 dark:text-dark-muted leading-relaxed mb-10 text-base">
                  Dengan memilih perdagangan langsung, kami memastikan bahwa setiap keluarga di balik secangkir kopi Anda
                  menerima upah yang layak, dan setiap panen ditangani dengan perhatian yang semestinya.
                </p>
              </>
            )}

            {/* Values grid */}
            <div className="grid sm:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, description }) => (
                <div key={title} className="group">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mb-3 group-hover:bg-terracotta/20 transition-colors duration-200">
                    <Icon size={18} className="text-terracotta" />
                  </div>
                  <h3 className="font-semibold text-espresso dark:text-dark-text text-sm mb-1">{title}</h3>
                  <p className="text-xs text-espresso/50 dark:text-dark-muted leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
