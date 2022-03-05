import { Indicator, Metric } from "types/metric.interface";

export interface AlertState {
  initialized: boolean
  alerts: Alert[]
}

export interface Alert {
  token_address: string
  metric: Metric
  indicator: Indicator
  value: number
  triggered: boolean
}

export interface AlertStateProps extends Partial<AlertState> {}

export interface AlertAddProps {
  alert: Alert
}

export interface AlertUpdateProps extends Partial<Alert> {
  previous: Alert
}