export interface Proposal {
  address: string
  msg: ProposalMessage
  authorIpfsHash: string
}

export interface ProposalMessage {
  version: string
  timestamp: string
  token: string
  type: string
  payload: ProposalMessagePayload
}

export interface ProposalMessagePayload {
  name: string
  body: string
  choices: string[]
  start: number
  end: number
  snapshot: number
  totalSupply: string
  quorum: string
}