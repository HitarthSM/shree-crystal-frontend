import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/FormControls'
import { PageHeader } from '@/components/ui/PageHeader'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/api/client'
import { toast } from '@/components/ui/Toast'
import { Save } from 'lucide-react'

interface ContentItem {
  text?: string
}

interface ContactInfo {
  email?: string
  phone?: string
  address?: string
}

export function AdminWebsiteCMS() {
  const queryClient = useQueryClient()
  const [aboutUsText, setAboutUsText] = useState('')
  const [visionText, setVisionText] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactAddress, setContactAddress] = useState('')

  // Fetch all existing settings
  const { data: aboutData } = useQuery<ContentItem | string>({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.about_us').then(res => res.data),
  })

  const { data: visionData } = useQuery<ContentItem | string>({
    queryKey: ['public.content.vision_mission'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.vision_mission').then(res => res.data),
  })

  const { data: contactData } = useQuery<ContactInfo>({
    queryKey: ['public.content.contact_info'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.contact_info').then(res => res.data),
  })

  useEffect(() => {
    if (aboutData) {
      if (typeof aboutData === 'string') setAboutUsText(aboutData)
      else if (aboutData.text) setAboutUsText(aboutData.text)
    }
  }, [aboutData])

  useEffect(() => {
    if (visionData) {
      if (typeof visionData === 'string') setVisionText(visionData)
      else if (visionData.text) setVisionText(visionData.text)
    }
  }, [visionData])

  useEffect(() => {
    if (contactData) {
      setContactEmail(contactData.email || '')
      setContactPhone(contactData.phone || '')
      setContactAddress(contactData.address || '')
    }
  }, [contactData])

  const updateSetting = useMutation({
    mutationFn: ({ key, value }: { key: string; value: Record<string, string> }) => 
      apiClient.put(`/settings/public-content/${key}`, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [variables.key] })
      toast.success('Content updated successfully')
    },
    onError: () => toast.error('Failed to update content')
  })

  const handleSaveAbout = () => {
    updateSetting.mutate({ key: 'public.content.about_us', value: { text: aboutUsText } })
  }

  const handleSaveVision = () => {
    updateSetting.mutate({ key: 'public.content.vision_mission', value: { text: visionText } })
  }

  const handleSaveContact = () => {
    updateSetting.mutate({ 
      key: 'public.content.contact_info', 
      value: { email: contactEmail, phone: contactPhone, address: contactAddress } 
    })
  }

  return (
    <div className="space-y-8 animate-fade-slide-up">
      <PageHeader
        title="Website CMS"
        description="Manage the dynamic text and content for the public website."
      />

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>About Us Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              label="About Us Text"
              className="min-h-[150px]"
              value={aboutUsText}
              onChange={(e) => setAboutUsText(e.target.value)}
              placeholder="Enter the history and overview of Shree Crystal..."
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveAbout}
                isLoading={updateSetting.isPending}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save About Us
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              label="Vision & Mission Text"
              className="min-h-[100px]"
              value={visionText}
              onChange={(e) => setVisionText(e.target.value)}
              placeholder="Enter the vision and mission statement..."
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveVision}
                isLoading={updateSetting.isPending}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Vision
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Support Email" 
                value={contactEmail} 
                onChange={(e) => setContactEmail(e.target.value)} 
                placeholder="support@shreecrystal.com" 
              />
              <Input 
                label="Phone Number" 
                value={contactPhone} 
                onChange={(e) => setContactPhone(e.target.value)} 
                placeholder="+91 9876543210" 
              />
            </div>
            <Textarea 
              label="Branch Address"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="Full address of the main branch..."
              rows={3}
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={handleSaveContact}
                isLoading={updateSetting.isPending}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Contact Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
