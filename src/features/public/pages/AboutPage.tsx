
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/api/client'

export function AboutPage() {
  const { data: aboutData, isLoading: isLoadingAbout } = useQuery({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/public/content/public.content.about_us').then(res => res.data),
  })

  const { data: visionData, isLoading: isLoadingVision } = useQuery({
    queryKey: ['public.content.vision_mission'],
    queryFn: () => apiClient.get('/public/content/public.content.vision_mission').then(res => res.data),
  })

  const aboutText = aboutData?.text || 'Shree Crystal Co-op has been the financial backbone of our local community for over three decades, offering secure savings and accessible credit with unparalleled transparency.'
  const visionText = visionData?.text || 'Our vision is to empower our members financially through transparent, secure, and easily accessible co-operative banking services.'

  return (
    <div className="bg-ivory min-h-screen pb-20">
      <section className="bg-deep-saffron relative overflow-hidden py-16">
        <div className="max-w-content mx-auto px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-display-lg font-display text-ivory leading-tight mb-4">
            About Us
          </h1>
          <p className="text-body-lg text-ivory/80 max-w-2xl mx-auto">
            Discover our history, our values, and our commitment to the community.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-warm-gold" />
      </section>

      <section className="max-w-content mx-auto px-6 lg:px-8 mt-16 space-y-16">
        <div className="space-y-6">
          <h2 className="text-display-md font-display text-dark-mahogany border-b border-ledger-rule pb-4">Our History & Overview</h2>
          {isLoadingAbout ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-ledger-rule rounded w-3/4"></div>
                <div className="h-4 bg-ledger-rule rounded"></div>
                <div className="h-4 bg-ledger-rule rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <div className="text-body-lg font-body text-dark-mahogany whitespace-pre-wrap leading-relaxed">
              {aboutText}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-display-md font-display text-dark-mahogany border-b border-ledger-rule pb-4">Vision & Mission</h2>
          {isLoadingVision ? (
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-ledger-rule rounded w-3/4"></div>
                <div className="h-4 bg-ledger-rule rounded"></div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-verdant-green/5 border border-verdant-green/20 rounded-[8px]">
              <p className="text-xl font-body italic text-dark-mahogany text-center leading-relaxed">
                "{visionText}"
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
