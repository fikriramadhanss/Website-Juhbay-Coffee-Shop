import { useState, useEffect, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Coffee, Home, Settings, Package, MessageSquare, LayoutDashboard, LogOut, Plus, Edit, Trash2, X, Loader2, Save, ShoppingCart } from 'lucide-react'
import { supabase, type MenuItem } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

type TabType = 'dashboard' | 'menu' | 'orders' | 'contacts' | 'settings'

type ContactSubmission = { id?: string; name: string; email: string; message: string; created_at?: string }
type OnlineOrder = { id: string; customer_name: string; customer_phone: string; items: { name: string; variant?: string; price: number; quantity: number }[]; total: number; status: string; notes: string; created_at: string }

type SiteSettings = {
  store_name: string
  description: string
  our_story: string
  address: string
  phone: string
  email: string
  operating_hours: { day: string; time: string }[]
  map_embed_url: string
}

const defaultSettings: SiteSettings = {
  store_name: 'Juhbay Coffee',
  description: '',
  our_story: '',
  address: '',
  phone: '',
  email: '',
  operating_hours: [{ day: 'Senin – Minggu', time: '10:00 – 23:00' }],
  map_embed_url: '',
}

export default function AdminDashboard() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [products, setProducts] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<OnlineOrder[]>([])
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Product form state
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({ name: '', category: '', variant: '', price: '', stock: '' })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetchData()

    // Realtime subscription untuk online_orders
    const channel = supabase
      .channel('online-orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'online_orders' }, () => {
        // Refetch orders saat ada INSERT, UPDATE, atau DELETE
        supabase.from('online_orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
          if (data) setOrders(data as OnlineOrder[])
        })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [user])

  async function fetchData() {
    setLoading(true)
    try {
      const { data: prodData } = await supabase.from('products').select('*').order('category').order('name')
      if (prodData) setProducts(prodData as MenuItem[])

      const { data: orderData } = await supabase.from('online_orders').select('*').order('created_at', { ascending: false })
      if (orderData) setOrders(orderData as OnlineOrder[])

      const { data: contactData } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
      if (contactData) setContacts(contactData as ContactSubmission[])

      const { data: settingsData } = await supabase.from('site_settings').select('*').single()
      if (settingsData) setSettings({ ...defaultSettings, ...settingsData, operating_hours: settingsData.operating_hours || defaultSettings.operating_hours })
    } catch (e) {
      console.error('Fetch error:', e)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-terracotta" size={32} /></div>
  if (!user) return <Navigate to="/admin/login" replace />

  function openAddForm() {
    setEditingItem(null)
    setFormData({ name: '', category: '', variant: '', price: '', stock: '50' })
    setShowForm(true)
  }

  function openEditForm(item: MenuItem) {
    setEditingItem(item)
    setFormData({ name: item.name, category: item.category, variant: item.variant || '', price: String(item.price), stock: String(item.stock) })
    setShowForm(true)
  }

  async function handleProductSubmit(e: FormEvent) {
    e.preventDefault()
    setFormLoading(true)

    const payload = {
      name: formData.name,
      category: formData.category,
      variant: formData.variant || null,
      price: Number(formData.price),
      stock: Number(formData.stock),
      is_active: true,
    }

    if (editingItem) {
      await supabase.from('products').update(payload).eq('id', editingItem.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setShowForm(false)
    setFormLoading(false)
    fetchData()
  }

  async function handleDelete(id: number) {
    if (!confirm('Hapus produk ini?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchData()
  }

  async function toggleActive(item: MenuItem) {
    await supabase.from('products').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchData()
  }

  async function handleDeleteOrder(id: string) {
    if (!confirm('Hapus pesanan ini?')) return
    await supabase.from('online_orders').delete().eq('id', id)
    fetchData()
  }

  async function handleSaveSettings(e: FormEvent) {
    e.preventDefault()
    setSettingsSaving(true)
    try {
      const { data: existing } = await supabase.from('site_settings').select('id').single()
      if (existing) {
        await supabase.from('site_settings').update(settings).eq('id', existing.id)
      } else {
        await supabase.from('site_settings').insert(settings)
      }
      alert('Pengaturan berhasil disimpan!')
    } catch {
      alert('Gagal menyimpan pengaturan.')
    }
    setSettingsSaving(false)
  }

  const SidebarItem = ({ icon: Icon, label, tab }: { icon: React.ComponentType<{ size?: number }>; label: string; tab: TabType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        activeTab === tab ? 'bg-terracotta text-cream font-medium' : 'text-espresso/60 hover:bg-stone-100 hover:text-espresso'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </button>
  )

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col fixed h-full">
        <div className="p-6 flex items-center gap-2 border-b border-stone-100">
          <Coffee size={24} className="text-terracotta" />
          <span className="font-serif text-xl font-bold text-espresso">Admin</span>
        </div>
        <div className="flex-1 p-4 space-y-2">
          <SidebarItem icon={LayoutDashboard} label="Dasbor" tab="dashboard" />
          <SidebarItem icon={Package} label="Produk" tab="menu" />
          <SidebarItem icon={ShoppingCart} label="Pesanan Online" tab="orders" />
          <SidebarItem icon={MessageSquare} label="Pesan" tab="contacts" />
          <SidebarItem icon={Settings} label="Pengaturan" tab="settings" />
        </div>
        <div className="p-4 border-t border-stone-100 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-espresso/60 hover:bg-stone-100 text-sm">
            <Home size={18} /> Kembali ke Web
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-serif font-bold text-espresso">
            {activeTab === 'dashboard' ? 'Dasbor' : activeTab === 'menu' ? 'Manajemen Produk' : activeTab === 'orders' ? 'Pesanan Online' : activeTab === 'contacts' ? 'Pesan Pelanggan' : 'Pengaturan'}
          </h1>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-terracotta" size={28} /></div>
        ) : (
          <>
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={Package} label="Total Produk" value={products.length} />
                <StatCard icon={ShoppingCart} label="Pesanan Online" value={orders.length} />
                <StatCard icon={MessageSquare} label="Pesan Masuk" value={contacts.length} />
                <div className="bg-white p-6 rounded-2xl border border-stone-200 flex items-center justify-center flex-col">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Online</span>
                  <p className="text-xs text-espresso/50 mt-2">Database Status</p>
                </div>
              </div>
            )}

            {/* Products */}
            {activeTab === 'menu' && (
              <div>
                {showForm && (
                  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                      <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-espresso/40 hover:text-espresso"><X size={20} /></button>
                      <h2 className="font-serif text-lg font-bold text-espresso mb-4">{editingItem ? 'Edit Produk' : 'Tambah Produk'}</h2>
                      <form onSubmit={handleProductSubmit} className="space-y-3">
                        <input required placeholder="Nama produk" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                        <div className="flex gap-3">
                          <input required placeholder="Kategori" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                          <input placeholder="Variant (opsional)" value={formData.variant} onChange={e => setFormData({ ...formData, variant: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                        </div>
                        <div className="flex gap-3">
                          <input required type="number" placeholder="Harga" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                          <input required type="number" placeholder="Stok" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                        </div>
                        <button type="submit" disabled={formLoading} className="w-full py-2.5 bg-terracotta text-cream font-semibold rounded-xl hover:bg-espresso transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                          {formLoading && <Loader2 size={16} className="animate-spin" />}
                          {editingItem ? 'Simpan' : 'Tambah'}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="p-5 border-b border-stone-100 flex justify-between items-center">
                    <h2 className="font-semibold text-espresso text-sm">Daftar Produk ({products.length})</h2>
                    <button onClick={openAddForm} className="flex items-center gap-1.5 px-3 py-1.5 bg-terracotta text-cream text-xs font-medium rounded-lg hover:bg-espresso transition-colors">
                      <Plus size={14} /> Tambah
                    </button>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 text-xs uppercase text-espresso/50">
                      <tr>
                        <th className="px-6 py-4">Produk</th>
                        <th className="px-6 py-4">Kategori</th>
                        <th className="px-6 py-4">Harga</th>
                        <th className="px-6 py-4">Stok</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-espresso/40">Belum ada produk.</td></tr>
                      ) : products.map(item => (
                        <tr key={item.id} className={`hover:bg-stone-50/50 ${!item.is_active ? 'opacity-50' : ''}`}>
                          <td className="px-6 py-4 font-medium text-espresso">
                            <p>{item.name}</p>
                            {item.variant && <p className="text-xs text-espresso/40">{item.variant}</p>}
                          </td>
                          <td className="px-6 py-4"><span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-stone-100 border border-stone-200">{item.category}</span></td>
                          <td className="px-6 py-4">Rp {item.price.toLocaleString('id-ID')}</td>
                          <td className="px-6 py-4">{item.stock}</td>
                          <td className="px-6 py-4">
                            <button onClick={() => toggleActive(item)} className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {item.is_active ? 'Aktif' : 'Nonaktif'}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => openEditForm(item)} className="p-1.5 text-espresso/40 hover:text-terracotta bg-stone-100 rounded-md"><Edit size={14} /></button>
                              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-espresso/40 hover:text-red-500 bg-stone-100 rounded-md"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center text-espresso/50">Belum ada pesanan online.</div>
                ) : orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-2xl border border-stone-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-espresso">{order.customer_name}</h3>
                        <p className="text-xs text-espresso/50">{order.customer_phone}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {order.status}
                        </span>
                        <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 text-espresso/40 hover:text-red-500 bg-stone-100 rounded-md"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <p className="text-[10px] text-espresso/40 mb-2">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-espresso/70">{item.name}{item.variant ? ` (${item.variant})` : ''} x{item.quantity}</span>
                          <span className="text-espresso font-medium">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-bold pt-2 border-t border-stone-200 mt-2">
                        <span>Total</span>
                        <span className="text-terracotta">Rp {order.total.toLocaleString('id-ID')}</span>
                      </div>
                    </div>
                    {order.notes && <p className="text-xs text-espresso/50 mt-2">Catatan: {order.notes}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Contacts */}
            {activeTab === 'contacts' && (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="bg-white p-10 rounded-2xl border border-stone-200 text-center text-espresso/50">Belum ada pesan.</div>
                ) : contacts.map((msg, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-espresso">{msg.name}</h3>
                        <p className="text-xs text-terracotta">{msg.email}</p>
                      </div>
                    </div>
                    <p className="text-sm text-espresso/70 bg-stone-50 p-4 rounded-xl border border-stone-100">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-stone-200 p-8 max-w-2xl space-y-5">
                <Field label="Nama Usaha" value={settings.store_name} onChange={v => setSettings({ ...settings, store_name: v })} />
                <Field label="Deskripsi Singkat" value={settings.description} onChange={v => setSettings({ ...settings, description: v })} textarea />
                <Field label="Cerita Kami" value={settings.our_story} onChange={v => setSettings({ ...settings, our_story: v })} textarea rows={5} />
                <Field label="Alamat" value={settings.address} onChange={v => setSettings({ ...settings, address: v })} textarea rows={2} />
                <Field label="Telepon / WhatsApp" value={settings.phone} onChange={v => setSettings({ ...settings, phone: v })} />
                <Field label="Email" value={settings.email} onChange={v => setSettings({ ...settings, email: v })} />

                <div className="pt-4 border-t border-stone-100">
                  <h3 className="text-sm font-semibold text-espresso mb-3">Jam Operasional</h3>
                  <div className="space-y-2">
                    {settings.operating_hours.map((h, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input placeholder="Hari" value={h.day} onChange={e => { const hrs = [...settings.operating_hours]; hrs[i] = { ...hrs[i], day: e.target.value }; setSettings({ ...settings, operating_hours: hrs }) }} className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                        <input placeholder="Jam" value={h.time} onChange={e => { const hrs = [...settings.operating_hours]; hrs[i] = { ...hrs[i], time: e.target.value }; setSettings({ ...settings, operating_hours: hrs }) }} className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                        <button type="button" onClick={() => { const hrs = settings.operating_hours.filter((_, idx) => idx !== i); setSettings({ ...settings, operating_hours: hrs }) }} className="p-1.5 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                      </div>
                    ))}
                    <button type="button" onClick={() => setSettings({ ...settings, operating_hours: [...settings.operating_hours, { day: '', time: '' }] })} className="text-xs text-terracotta hover:underline flex items-center gap-1"><Plus size={12} /> Tambah jam</button>
                  </div>
                </div>

                <Field label="Google Maps Embed URL" value={settings.map_embed_url} onChange={v => setSettings({ ...settings, map_embed_url: v })} textarea rows={2} />

                <button type="submit" disabled={settingsSaving} className="px-6 py-2.5 bg-terracotta text-cream text-sm font-semibold rounded-xl hover:bg-espresso transition-colors disabled:opacity-50 flex items-center gap-2">
                  {settingsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Simpan Perubahan
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: number }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200">
      <div className="w-10 h-10 rounded-lg bg-terracotta/10 flex items-center justify-center mb-4">
        <Icon size={20} className="text-terracotta" />
      </div>
      <h3 className="text-2xl font-bold text-espresso">{value}</h3>
      <p className="text-sm text-espresso/60 mt-1">{label}</p>
    </div>
  )
}

function Field({ label, value, onChange, textarea, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number }) {
  const cls = "w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta resize-none"
  return (
    <div>
      <label className="block text-xs font-semibold text-espresso/70 mb-1.5 uppercase tracking-wide">{label}</label>
      {textarea ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cls} /> : <input type="text" value={value} onChange={e => onChange(e.target.value)} className={cls} />}
    </div>
  )
}
