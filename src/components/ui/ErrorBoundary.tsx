import { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import { Button } from './Button'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
          <Card padding="lg" className="w-full max-w-md bg-white border-ledger-rule shadow-paper animate-fade-slide-up text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-deep-crimson/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-deep-crimson" />
              </div>
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl">Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="font-body text-sm text-mahogany-muted mb-8">
                An unexpected error occurred. Our team has been notified. 
                Please try refreshing the page or contact support if the problem persists.
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="primary" 
                  onClick={() => window.location.reload()}
                  leftIcon={<RefreshCcw className="h-4 w-4" />}
                >
                  Reload Page
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = '/'}
                >
                  Go to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
