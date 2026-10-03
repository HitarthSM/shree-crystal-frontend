import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Textarea } from './FormControls'
import { CheckCircle2, X, Send } from 'lucide-react'
import { format } from 'date-fns'
import type { SupportQuery } from '@/types/query'

export interface QueryChatThreadProps {
  query: SupportQuery
  currentUserRole: 'ADMIN' | 'MEMBER'
  onClose?: () => void
  onSendReply: (message: string, resolve?: boolean) => Promise<void>
  isSending?: boolean
}

export function QueryChatThread({
  query,
  currentUserRole,
  onClose,
  onSendReply,
  isSending = false,
}: QueryChatThreadProps) {
  const [replyText, setReplyText] = useState('')

  const handleSend = async (resolve: boolean = false) => {
    if (!replyText.trim() || isSending) return
    await onSendReply(replyText.trim(), resolve)
    setReplyText('')
  }

  const isResolved = query.status === 'RESOLVED'

  return (
    <Card padding="none" className="h-[700px] flex flex-col relative animate-fade-in">
      {/* Header */}
      <CardHeader className="p-4 border-b border-ledger-rule flex flex-row items-start justify-between shrink-0 bg-white rounded-t-[6px]">
        <div>
          <CardTitle className="text-lg leading-tight mb-1">{query.subject}</CardTitle>
          <p className="text-sm text-mahogany-muted">
            {currentUserRole === 'ADMIN' && query.member
              ? `Raised by ${query.member.fullName} (${query.member.memberId}) on `
              : 'Raised on '}
            {query.createdAt ? format(new Date(query.createdAt), 'dd MMM yyyy') : 'Recent'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isResolved ? 'resolved' : 'pending'}>{query.status}</Badge>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close ticket view"
              className="p-1 text-mahogany-muted hover:text-dark-mahogany md:hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-6 overflow-y-auto flex-1 space-y-6 bg-white/50">
        {query.messages && query.messages.length > 0 ? (
          query.messages.map((msg) => {
            const isMe =
              (currentUserRole === 'ADMIN' && msg.senderType === 'ADMIN') ||
              (currentUserRole === 'MEMBER' && msg.senderType === 'MEMBER')

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-dark-mahogany">
                    {msg.senderType === 'ADMIN'
                      ? 'Society Office'
                      : query.member?.fullName || 'Member'}
                  </span>
                  <span className="text-[10px] text-mahogany-muted">
                    {msg.createdAt
                      ? format(new Date(msg.createdAt), 'dd MMM HH:mm')
                      : ''}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm font-body shadow-sm ${
                    isMe
                      ? 'bg-dark-mahogany text-ivory rounded-tr-none'
                      : 'bg-ivory border border-ledger-rule text-dark-mahogany rounded-tl-none'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-sm text-mahogany-muted">
            No message history yet.
          </div>
        )}

        {isResolved && (
          <div className="flex items-center justify-center py-4">
            <div className="bg-verdant-green/10 text-verdant-green text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              This support query has been resolved
            </div>
          </div>
        )}
      </CardContent>

      {/* Reply Box */}
      {!isResolved && (
        <div className="p-4 border-t border-ledger-rule bg-white shrink-0 rounded-b-[6px]">
          <Textarea
            label=""
            aria-label="Write a message"
            placeholder={
              currentUserRole === 'ADMIN'
                ? 'Type your reply to the member...'
                : 'Type your message to the society office...'
            }
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="mb-3"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-xs text-mahogany-muted font-body">
              {currentUserRole === 'ADMIN'
                ? 'Press Send & Resolve if this concludes the inquiry.'
                : 'The society office usually responds within 24 hours.'}
            </p>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSend(false)}
                disabled={!replyText.trim() || isSending}
                isLoading={isSending}
                rightIcon={<Send className="h-3.5 w-3.5" />}
              >
                Send
              </Button>
              {currentUserRole === 'ADMIN' && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => handleSend(true)}
                  isLoading={isSending}
                  disabled={!replyText.trim()}
                >
                  Send & Resolve
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
