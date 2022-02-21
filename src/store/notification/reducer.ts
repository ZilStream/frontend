import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { NotificationActionTypes } from "./actions";
import { NotificationAddProps, NotificationState, NotificationStateProps } from "./types";

const initialState: NotificationState = {
  initialized: false,
  notifications: []
}

const reducer = (state: NotificationState = initialState, action: AnyAction) => {
  const { payload } = action

  switch(action.type) {
    case HYDRATE:
      return {...state, ...action.payload.notification}

    case NotificationActionTypes.NOTIFICATION_SET_STATE:
      const stateProps: NotificationStateProps = payload
      return {
        ...stateProps
      }

    case NotificationActionTypes.ADD_NOTIFICATION:
      const addProps: NotificationAddProps = payload
      return {
        ...state,
        notifications: [
          ...state.notifications,
          addProps.notification
        ]
      }

    default:
      return state
  }
}

export default reducer