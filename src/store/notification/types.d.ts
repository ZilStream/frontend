export type NotificationState = {
  initialized: boolean
  notifications: Notification[] 
}

export interface Notification {
  timestamp: number
  title: string
  hash: string
  status: "pending"|"success"|"failed"
}

export interface NotificationStateProps extends Partial<NotificationState> {}

export interface NotificationAddProps {
  notification: Notification
}