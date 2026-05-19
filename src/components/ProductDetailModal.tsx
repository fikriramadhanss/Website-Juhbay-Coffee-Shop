import { X, ShoppingCart, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import type { MenuItem } from '../lib/supabaseClient'
import { useCart } from '../contexts/CartContext'

type Props = { item: MenuItem; onClose: () => void }

export default function ProductDetailModal({ item, onClose }: Props) {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(item)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white dark:bg-dark-surface rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20">
                {item.category}
              </span>
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-dark-border text-espresso/50 dark:text-dark-muted">
              <X size={16} />
            </button>
          </div>

          <h2 className="font-serif text-2xl font-bold text-espresso dark:text-dark-text mb-1">{item.name}</h2>
          {item.variant && <p className="text-sm text-espresso/50 dark:text-dark-muted mb-4">{item.variant}</p>}
          <p className="font-serif text-2xl font-bold text-terracotta mb-6">Rp {item.price.toLocaleString('id-ID')}</p>

          {/* Quantity + Add */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-stone-200 dark:border-dark-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-dark-border text-espresso/60 dark:text-dark-muted"><Minus size={16} /></button>
              <span className="px-4 py-2.5 text-sm font-semibold text-espresso dark:text-dark-text min-w-[40px] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-3 py-2.5 hover:bg-stone-50 dark:hover:bg-dark-border text-espresso/60 dark:text-dark-muted"><Plus size={16} /></button>
            </div>
            <button onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 py-3 bg-terracotta text-cream font-semibold rounded-xl hover:bg-espresso transition-colors">
              <ShoppingCart size={16} />
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
