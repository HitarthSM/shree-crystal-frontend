import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Input } from '@/components/ui/FormControls'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../api/client'
import toast from 'react-hot-toast'
import { Save } from 'lucide-react'

// Simple CMS text editor
export function AdminWebsiteCMS() {
  const queryClient = useQueryClient()
  const [aboutUsText, setAboutUsText] = useState('')
  const [visionText, setVisionText] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactAddress, setContactAddress] = useState('')

  // Fetch all existing settings
  useQuery({
    queryKey: ['public.content.about_us'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.about_us').then(res => res.data),
    meta: {
      onSuccess: (data: any) => {
        if (data && typeof data === 'string') setAboutUsText(data)
        else if (data?.text) setAboutUsText(data.text)
      }
    }
  })

  useQuery({
    queryKey: ['public.content.vision_mission'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.vision_mission').then(res => res.data),
    meta: {
      onSuccess: (data: any) => {
        if (data && typeof data === 'string') setVisionText(data)
        else if (data?.text) setVisionText(data.text)
      }
    }
  })

  useQuery({
    queryKey: ['public.content.contact_info'],
    queryFn: () => apiClient.get('/settings/public-content/public.content.contact_info').then(res => res.data),
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setContactEmail(data.email || '')
          setContactPhone(data.phone || '')
          setContactAddress(data.address || '')
        }
      }
    }
  })

  const updateSetting = useMutation({
    mutationFn: ({ key, value }: { key: string, value: any }) => 
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
      <header>
        <h1 className="text-display-md font-display text-dark-mahogany mb-1">
          Website CMS
        </h1>
        <p className="text-body text-mahogany-muted">
          Manage the dynamic text and content for the public website.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>About Us Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-dark-mahogany">About Us Text</label>
              <textarea 
                className="w-full min-h-[150px] p-3 border border-ledger-rule rounded-md focus:outline-none focus:ring-2 focus:ring-verdant-green/50 font-body"
                value={aboutUsText}
                onChange={e => setAboutUsText(e.target.value)}
                placeholder="Enter the history and overview of Shree Crystal..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveAbout} isLoading={updateSetting.isPending} className="gap-2">
                <Save className="w-4 h-4" /> Save About Us
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision & Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-dark-mahogany">Vision & Mission Text</label>
              <textarea 
                className="w-full min-h-[100px] p-3 border border-ledger-rule rounded-md focus:outline-none focus:ring-2 focus:ring-verdant-green/50 font-body"
                value={visionText}
                onChange={e => setVisionText(e.target.value)}
                placeholder="Enter the vision and mission statement..."
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveVision} isLoading={updateSetting.isPending} className="gap-2">
                <Save className="w-4 h-4" /> Save Vision
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
                onChange={(e: any) => setContactEmail(e.target.value)} 
                placeholder="support@shreecrystal.com" 
              />
              <Input 
                label="Phone Number" 
                value={contactPhone} 
                onChange={(e: any) => setContactPhone(e.target.value)} 
                placeholder="+91 9876543210" 
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <label className="text-sm font-medium text-dark-mahogany">Branch Address</label>
              <textarea 
                className="w-full p-3 border border-ledger-rule rounded-md focus:outline-none focus:ring-2 focus:ring-verdant-green/50 font-body"
                value={contactAddress}
                onChange={e => setContactAddress(e.target.value)}
                placeholder="Full address of the main branch..."
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveContact} isLoading={updateSetting.isPending} className="gap-2">
                <Save className="w-4 h-4" /> Save Contact Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
