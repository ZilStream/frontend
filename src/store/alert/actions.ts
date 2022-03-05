import { Alert, AlertAddProps, AlertStateProps, AlertUpdateProps } from "./types";

export const AlertActionTypes = {
  ALERT_SET_STATE: "ALERT_SET_STATE",
  ADD_ALERT: "ADD_ALERT",
  UPDATE_ALERT: "UPDATE_ALERT",
  DELETE_ALERT: "DELETE_ALERT"
}

export function setAlertState(payload: AlertStateProps) {
  return {
    type: AlertActionTypes.ALERT_SET_STATE,
    payload
  }
}

export function addAlert(payload: AlertAddProps) {
  return {
    type: AlertActionTypes.ADD_ALERT,
    payload
  }
}

export function updateAlert(payload: AlertUpdateProps) {
  return {
    type: AlertActionTypes.UPDATE_ALERT,
    payload
  }
}

export function deleteAlert(payload: AlertAddProps) {
  return {
    type: AlertActionTypes.DELETE_ALERT,
    payload
  }
}