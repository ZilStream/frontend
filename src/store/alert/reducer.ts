import { AlertAddProps, AlertState, AlertStateProps, AlertUpdateProps } from "./types";
import {HYDRATE} from 'next-redux-wrapper';
import { AnyAction } from 'redux';
import { AlertActionTypes } from "./actions";

const initialState: AlertState = {
  initialized: false,
  alerts: []
}

const reducer = (state: AlertState = initialState, action: AnyAction) => {
  const { payload } = action

  switch (action.type) {
    case HYDRATE:
      return {...state, ...action.payload.alert}

    case AlertActionTypes.ALERT_SET_STATE:
      const stateProps: AlertStateProps = payload
      return {
        ...stateProps
      }

    case AlertActionTypes.ADD_ALERT:
      const addProps: AlertAddProps = payload
      return {
        ...state,
        alerts: [
          ...state.alerts,
          addProps.alert
        ]
      }

    case AlertActionTypes.UPDATE_ALERT:
      const updateProps: AlertUpdateProps = payload
      return {
        ...state,
        alerts: state.alerts.map(alert => alert === updateProps.previous ?
          {...alert, ...updateProps} :
          alert
        ),
      }

    case AlertActionTypes.DELETE_ALERT:
      const deleteProps: AlertAddProps = payload
      return {
        ...state,
        alerts: [
          ...state.alerts.filter(alert => alert.token_address !== deleteProps.alert.token_address && alert.metric !== deleteProps.alert.metric && alert.indicator !== deleteProps.alert.indicator && alert.value !== deleteProps.alert.value)
        ]
      }

    default:
      return state
  }
}

export default reducer