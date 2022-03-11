import { NotificationAddProps, NotificationRemoveProps, NotificationStateProps } from "./types";

export const NotificationActionTypes = {
  NOTIFICATION_SET_STATE: "NOTIFICATION_SET_STATE",
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION"
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

export function removeNotification(payload: NotificationRemoveProps) {
  return {
    type: NotificationActionTypes.REMOVE_NOTIFICATION,
    payload
  }
}