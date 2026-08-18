
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { Mail, Phone, MapPin } from 'lucide-react'

export function ContactPage() {
  const { data: contactData, isLoading } = useQuery({
    queryKey: ['public.content.contact_info'],
    queryFn: () => apiClient.get('/public/content/public.content.contact_info').then(res => res.data),
  })

  const email = contactData?.email || 'support@shreecrystal.com'
  const phone = contactData?.phone || '+91 98765 43210'
  const address = contactData?.address || '123 Crystal Avenue, Financial District, Surat, Gujarat 395009'

  return (
    <div className="bg-ivory min-h-screen pb-20">
      <section className="bg-deep-saffron relative overflow-hidden py-16">
        <div className="max-w-content mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-display-lg font-display text-ivory leading-tight mb-4">
            Contact Us
          </h1>
          <p className="text-body-lg text-ivory/80 max-w-2xl mx-auto">
            We are here to assist you. Reach out to our dedicated support team or visit our branch.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      <section className="max-w-content mx-auto px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <h2 className="text-display-md font-display text-dark-mahogany">Get in Touch</h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-warm-gold/10 rounded-full text-warm-gold shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">Phone</h3>
                {isLoading ? (
                  <div className="h-4 bg-ledger-rule rounded w-32 animate-pulse mt-2"></div>
                ) : (
                  <p className="text-body text-mahogany-muted">{phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-warm-gold/10 rounded-full text-warm-gold shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">Email</h3>
                {isLoading ? (
                  <div className="h-4 bg-ledger-rule rounded w-48 animate-pulse mt-2"></div>
                ) : (
                  <p className="text-body text-mahogany-muted">{email}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-warm-gold/10 rounded-full text-warm-gold shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-lg text-dark-mahogany mb-1">Main Branch</h3>
                {isLoading ? (
                  <div className="h-4 bg-ledger-rule rounded w-full max-w-xs animate-pulse mt-2"></div>
                ) : (
                  <p className="text-body text-mahogany-muted whitespace-pre-wrap">{address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-2 rounded-[8px] shadow-paper border border-ledger-rule h-full min-h-[400px] overflow-hidden">
          <iframe 
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: '400px' }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-[4px]"
            title="Branch Location Map"
          />
        </div>
      </section>
    </div>
  )
}
