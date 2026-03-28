import Pusher from 'pusher'

let _pusher: Pusher | null = null

export function getPusherServer(): Pusher {
  if (!_pusher) {
    _pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })
  }
  return _pusher
}

export const CRM_CHANNEL = 'crm-updates'
export const CRM_EVENT = 'data-changed'
