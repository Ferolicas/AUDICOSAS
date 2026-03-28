import PusherJs from 'pusher-js'

let _client: PusherJs | null = null

export function getPusherClient(): PusherJs {
  if (!_client) {
    _client = new PusherJs(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  }
  return _client
}

export const CRM_CHANNEL = 'crm-updates'
export const CRM_EVENT = 'data-changed'
