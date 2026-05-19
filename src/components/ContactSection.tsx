import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useSiteSettings } from '../lib/useSiteSettings'
import { MapPin, Clock, Send, Loader } from 'lucide-react'
import { ToastContainer, type ToastMessage } from './Toast'

type FormState = {
  name: string
  email: string
  message: string
}

type FormErrors = Partial<FormState>

function validateForm(data: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!data.name.trim()) errors.name = 'Nama wajib diisi.'
  if (!data.email.trim()) {
    errors.email = 'Email wajib diisi.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Silakan masukkan email yang valid.'
  }
  if (!data.message.trim()) errors.message = 'Pesan wajib diisi.'
  else if (data.message.trim().length < 10) errors.message = 'Pesan minimal terdiri dari 10 karakter.'
  return errors
}

const defaultHours = [
  { day: 'Senin – Jumat', time: '07:00 – 21:00' },
  { day: 'Sabtu', time: '08:00 – 22:00' },
  { day: 'Minggu', time: '09:00 – 20:00' },
]

const defaultAddress = 'Jl. Kopi Raya No. 12, Kemang\nJakarta Selatan 12730\nIndonesia'
const defaultMapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.8165!3d-6.2607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMzkuMCJTIDEwNsKwNDgnNTkuNCJF!5e0!3m2!1sen!2sid!4v1'

export default function ContactSection() {
  const settings = useSiteSettings()
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validateForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('contact_submissions').insert([
        {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        },
      ])

      if (error) throw error

      addToast({
        type: 'success',
        title: 'Pesan terkirim!',
        message: 'Terima kasih telah menghubungi kami. Kami akan merespon dalam waktu 24 jam.',
      })
      setForm({ name: '', email: '', message: '' })
      setErrors({})
    } catch {
      addToast({
        type: 'error',
        title: 'Terjadi kesalahan',
        message: 'Kami gagal mengirim pesan Anda. Silakan coba lagi atau email kami secara langsung.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const inputBase =
    'w-full px-4 py-3 rounded-xl border bg-white dark:bg-dark-surface text-espresso dark:text-dark-text text-sm placeholder-espresso/30 dark:placeholder-dark-muted/50 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all duration-200'
  const inputError = 'border-red-300 focus:ring-red-200 focus:border-red-400'
  const inputNormal = 'border-stone-200 dark:border-dark-border hover:border-stone-300 dark:hover:border-dark-muted/50'

  return (
    <>
      <section id="contact" className="py-28 lg:py-36 bg-cream dark:bg-dark-bg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-terracotta mb-4">
              Hubungi Kami
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-espresso dark:text-dark-text mb-4">
              Kami Ingin Mendengar dari Anda
            </h2>
            <p className="text-espresso/55 dark:text-dark-muted max-w-xl mx-auto leading-relaxed">
              Baik Anda memiliki pertanyaan, keperluan grosir, atau sekadar ingin menyapa — tim kami selalu senang untuk terhubung.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

            {/* Left — Info */}
            <div className="lg:col-span-2 space-y-10">
              {/* Address */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <MapPin size={15} className="text-terracotta" />
                  </div>
                  <h3 className="font-semibold text-espresso dark:text-dark-text text-sm">Lokasi Kami</h3>
                </div>
                <p className="text-espresso/60 dark:text-dark-muted text-sm leading-relaxed whitespace-pre-line">
                  {settings?.address || defaultAddress}
                </p>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center">
                    <Clock size={15} className="text-terracotta" />
                  </div>
                  <h3 className="font-semibold text-espresso dark:text-dark-text text-sm">Jam Operasional</h3>
                </div>
                <ul className="space-y-2">
                  {(settings?.operating_hours || defaultHours).map((h) => (
                    <li key={h.day} className="flex justify-between text-sm">
                      <span className="text-espresso/50 dark:text-dark-muted">{h.day}</span>
                      <span className="font-medium text-espresso dark:text-dark-text">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border shadow-sm">
                <iframe
                  title="Peta lokasi Juhbay Coffee"
                  src={settings?.map_embed_url || defaultMapUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            {/* Right — Form */}
            <div className="lg:col-span-3">
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                noValidate
                className="bg-white dark:bg-dark-surface rounded-2xl border border-stone-100 dark:border-dark-border shadow-sm shadow-espresso/5 p-8 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-espresso/70 dark:text-dark-muted mb-1.5 uppercase tracking-wide">
                      Nama Lengkap
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nama Anda"
                      className={`${inputBase} ${errors.name ? inputError : inputNormal}`}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-espresso/70 dark:text-dark-muted mb-1.5 uppercase tracking-wide">
                      Alamat Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="anda@email.com"
                      className={`${inputBase} ${errors.email ? inputError : inputNormal}`}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-espresso/70 dark:text-dark-muted mb-1.5 uppercase tracking-wide">
                    Pesan
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Beri tahu kami apa yang bisa dibantu..."
                    className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1.5 text-xs text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="contact-submit-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-terracotta text-cream text-sm font-semibold rounded-xl hover:bg-espresso transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {submitting ? (
                    <>
                      <Loader size={16} className="animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
