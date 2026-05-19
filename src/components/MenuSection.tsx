import { useState, useEffect } from 'react'
import { supabase, type MenuItem } from '../lib/supabaseClient'
import { useCart } from '../contexts/CartContext'

const PREVIEW_COUNT = 4

type GroupedProduct = {
  name: string
  category: string
  variants: MenuItem[]
}

function groupProducts(items: MenuItem[]): GroupedProduct[] {
  const map = new Map<string, GroupedProduct>()
  for (const item of items) {
    const key = `${item.name}__${item.category}`
    if (!map.has(key)) {
      map.set(key, { name: item.name, category: item.category, variants: [] })
    }
    map.get(key)!.variants.push(item)
  }
  return [...map.values()]
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface">
      <div className="p-6 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded-full" />
        <div className="skeleton h-3 w-1/2 rounded-full" />
        <div className="flex justify-between items-center pt-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function MenuCard({ group, onAdd }: { group: GroupedProduct; onAdd: (item: MenuItem) => void }) {
  const [selected, setSelected] = useState(0)
  const current = group.variants[selected]
  const hasVariants = group.variants.length > 1

  return (
    <div className="group rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:shadow-xl hover:shadow-espresso/8 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-serif text-lg font-semibold text-espresso dark:text-dark-text leading-snug">{group.name}</h3>
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 shrink-0">
            {group.category}
          </span>
        </div>

        {hasVariants && (
          <div className="flex gap-1.5 mb-3">
            {group.variants.map((v, i) => (
              <button
                key={v.id}
                onClick={() => setSelected(i)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  selected === i
                    ? 'bg-espresso dark:bg-cream text-cream dark:text-espresso'
                    : 'bg-stone-100 dark:bg-dark-border text-espresso/60 dark:text-dark-muted hover:text-terracotta'
                }`}
              >
                {v.variant}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <span className="font-serif text-xl font-bold text-terracotta">
            Rp {current.price.toLocaleString('id-ID')}
          </span>
          <button
            onClick={() => onAdd(current)}
            disabled={current.stock <= 0}
            className="px-4 py-2 text-xs font-medium rounded-full border border-espresso/20 dark:border-dark-border text-espresso dark:text-dark-text hover:bg-terracotta hover:text-cream hover:border-terracotta transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {current.stock <= 0 ? 'Habis' : 'Tambah Pesanan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MenuSection() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [categories, setCategories] = useState<string[]>(['Semua'])
  const { addItem } = useCart()

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('category')
          .order('name')

        if (error) console.warn('products fetch error:', error.message)
        const products = (data as MenuItem[]) || []
        setItems(products)
        const cats = [...new Set(products.map(p => p.category))]
        setCategories(['Semua', ...cats])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const filtered = activeCategory === 'Semua'
    ? items
    : items.filter((item) => item.category === activeCategory)

  const grouped = groupProducts(filtered)
  const displayItems = expanded ? grouped : grouped.slice(0, PREVIEW_COUNT)

  return (
    <section id="menu" className="py-28 lg:py-36 bg-stone-50/70 dark:bg-dark-surface/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-terracotta mb-4">
            Menu Kami
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-espresso dark:text-dark-text mb-4 text-balance">
            Diramu dengan Niat & Ketelitian
          </h2>
          <p className="text-espresso/55 dark:text-dark-muted max-w-xl mx-auto leading-relaxed">
            Setiap pilihan pada menu kami adalah hasil seleksi ketat — bahan-bahan pilihan yang disiapkan dengan penuh pertimbangan.
          </p>
        </div>

        {expanded && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12" role="tablist" aria-label="Kategori menu">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-espresso dark:bg-cream dark:text-espresso text-cream shadow-sm'
                    : 'bg-white dark:bg-dark-surface border border-stone-200 dark:border-dark-border text-espresso/60 dark:text-dark-muted hover:border-terracotta/40 hover:text-terracotta'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: PREVIEW_COUNT }).map((_, i) => <SkeletonCard key={i} />)
            : displayItems.map((group) => <MenuCard key={`${group.name}-${group.category}`} group={group} onAdd={addItem} />)
          }
        </div>

        {!loading && !expanded && grouped.length > PREVIEW_COUNT && (
          <div className="text-center mt-10">
            <button
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-espresso/20 dark:border-dark-border text-espresso dark:text-dark-text text-sm font-medium rounded-full hover:border-terracotta hover:text-terracotta transition-colors duration-300"
            >
              Lihat Menu Lengkap ({grouped.length} item)
            </button>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-espresso/40 dark:text-dark-muted text-sm">Tidak ada menu di kategori ini.</p>
          </div>
        )}
      </div>
    </section>
  )
}
