import { NotificationAddProps, NotificationStateProps } from "./types";

export const NotificationActionTypes = {
  NOTIFICATION_SET_STATE: "NOTIFICATION_SET_STATE",
  ADD_NOTIFICATION: "ADD_NOTIFICATION"
}

export function setNotificationState(payload: NotificationStateProps) {
  return {
    type: NotificationActionTypes.NOTIFICATION_SET_STATE,
    payload
  }
}

export function addNotification(payload: NotificationAddProps) {
  return {
    type: NotificationActionTypes.ADD_NOTIFICATION,
    payload
  }
}