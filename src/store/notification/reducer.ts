import { HYDRATE } from "next-redux-wrapper";
import { AnyAction } from "redux";
import { NotificationActionTypes } from "./actions";
import { NotificationAddProps, NotificationRemoveProps, NotificationState, NotificationStateProps, NotificationUpdateProps } from "./types";

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

    case NotificationActionTypes.UPDATE_NOTIFICATION:
      const updateProps: NotificationUpdateProps = payload
      return {
        ...state,
        notifications: state.notifications.map(notification => notification.hash === updateProps.hash ?
          {...notification, ...updateProps} :
          notification
          ),
      }

    case NotificationActionTypes.REMOVE_NOTIFICATION:
      const removeProps: NotificationRemoveProps = payload
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.hash !== removeProps.hash)
      }

    default:
      return state
  }
}

export default reducer