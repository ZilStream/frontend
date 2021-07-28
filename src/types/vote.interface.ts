export interface Vote {
  address: string
  msg: VoteMessage
}

export interface VoteMessage {
  timestamp: string
  payload: VotePayload
}

export interface VotePayload {
  proposal: string
  choice: number
}