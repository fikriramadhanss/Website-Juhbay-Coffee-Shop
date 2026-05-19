import { useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, Loader } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabaseClient'
import { useSiteSettings } from '../lib/useSiteSettings'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, totalItems, clearCart } = useCart()
  const settings = useSiteSettings()
  const [showCheckout, setShowCheckout] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleCheckout = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Nama, nomor WhatsApp, dan alamat wajib diisi.')
      return
    }
    setError('')
    setSubmitting(true)

    const orderItems = items.map(i => ({
      id: i.id,
      name: i.name,
      variant: i.variant,
      price: i.price,
      quantity: i.quantity,
    }))

    try {
      const { error: insertError } = await supabase.from('online_orders').insert([{
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        items: orderItems,
        total,
        notes: `Alamat: ${address.trim()}${notes.trim() ? `\nCatatan: ${notes.trim()}` : ''}`,
      }])

      if (insertError) throw insertError

      // Build WhatsApp message
      const storeName = settings?.store_name || 'Juhbay Coffee'
      const storePhone = settings?.phone?.replace(/\D/g, '') || ''
      const itemLines = items.map(i => {
        const variantStr = i.variant ? ` (${i.variant})` : ''
        return `• ${i.name}${variantStr} x${i.quantity} — Rp ${(i.price * i.quantity).toLocaleString('id-ID')}`
      }).join('\n')
      const msg = `Halo ${storeName}! 👋\n\nSaya ingin memesan:\n${itemLines}\n\n*Total: Rp ${total.toLocaleString('id-ID')}*\n\nNama: ${name.trim()}\nNo. HP: ${phone.trim()}\nAlamat: ${address.trim()}${notes.trim() ? `\nCatatan: ${notes.trim()}` : ''}\n\nTerima kasih! 🙏`

      const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(msg)}`

      clearCart()
      setShowCheckout(false)
      setName('')
      setPhone('')
      setAddress('')
      setNotes('')

      window.open(waUrl, '_blank')
    } catch {
      setError('Gagal mengirim pesanan. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={toggleCart}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white dark:bg-dark-surface h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-terracotta" />
            <h2 className="font-serif text-lg font-bold text-espresso dark:text-dark-text">Keranjang</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-terracotta/10 text-terracotta rounded-full">{totalItems}</span>
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-stone-100 dark:hover:bg-dark-border rounded-lg text-espresso/50 dark:text-dark-muted"><X size={20} /></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-stone-200 dark:text-dark-border mb-4" />
              <p className="text-sm text-espresso/40 dark:text-dark-muted">Keranjang masih kosong</p>
            </div>
          ) : items.map(item => (
            <div key={item.id} className="flex gap-3 p-3 rounded-xl border border-stone-100 dark:border-dark-border bg-stone-50/50 dark:bg-dark-bg/50">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-espresso dark:text-dark-text truncate">{item.name}</h4>
                {item.variant && <p className="text-[11px] text-espresso/40 dark:text-dark-muted">{item.variant}</p>}
                <p className="text-xs text-terracotta font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded border border-stone-200 dark:border-dark-border hover:bg-stone-100 dark:hover:bg-dark-border text-espresso dark:text-dark-text"><Minus size={12} /></button>
                  <span className="text-xs font-semibold w-5 text-center text-espresso dark:text-dark-text">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded border border-stone-200 dark:border-dark-border hover:bg-stone-100 dark:hover:bg-dark-border text-espresso dark:text-dark-text"><Plus size={12} /></button>
                  <button onClick={() => removeItem(item.id)} className="ml-auto p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 dark:border-dark-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-espresso/60 dark:text-dark-muted">Total</span>
              <span className="font-serif text-xl font-bold text-espresso dark:text-dark-text">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {!showCheckout ? (
              <>
                <button onClick={() => setShowCheckout(true)} className="w-full py-3.5 bg-terracotta text-cream font-semibold rounded-xl hover:bg-espresso transition-colors">
                  Checkout via WhatsApp
                </button>
                <button onClick={clearCart} className="w-full py-2 text-xs text-espresso/40 dark:text-dark-muted hover:text-red-500 transition-colors">
                  Kosongkan Keranjang
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Anda *"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-bg text-espresso dark:text-dark-text text-sm placeholder-espresso/30 dark:placeholder-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
                <input
                  type="tel"
                  placeholder="Nomor WhatsApp * (cth: 08123456789)"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-bg text-espresso dark:text-dark-text text-sm placeholder-espresso/30 dark:placeholder-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
                <textarea
                  placeholder="Alamat lengkap *"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-bg text-espresso dark:text-dark-text text-sm placeholder-espresso/30 dark:placeholder-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none"
                />
                <textarea
                  placeholder="Catatan (opsional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 dark:border-dark-border bg-white dark:bg-dark-bg text-espresso dark:text-dark-text text-sm placeholder-espresso/30 dark:placeholder-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none"
                />
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  onClick={handleCheckout}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-terracotta text-cream font-semibold rounded-xl hover:bg-espresso transition-colors disabled:opacity-60"
                >
                  {submitting ? <><Loader size={16} className="animate-spin" /> Mengirim...</> : 'Kirim Pesanan & Buka WhatsApp'}
                </button>
                <button onClick={() => { setShowCheckout(false); setError('') }} className="w-full py-2 text-xs text-espresso/40 dark:text-dark-muted hover:text-espresso dark:hover:text-dark-text transition-colors">
                  Kembali
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
