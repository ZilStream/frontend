export type NotificationState = {
  initialized: boolean
  notifications: Notification[] 
}

export interface Notification {
  timestamp: number
  title?: string
  hash: string
  status: "pending"|"confirmed"|"rejected"
}

export interface NotificationStateProps extends Partial<NotificationState> {}

export interface NotificationAddProps {
  notification: Notification
}

export interface NotificationRemoveProps {
  hash: string
}

export interface NotificationUpdateProps extends Partial<Notification> {
  hash: string
}