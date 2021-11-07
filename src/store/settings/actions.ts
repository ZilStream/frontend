import { UpdateColumnsProps, UpdateFiltersProps, UpdateSettingsProps } from "store/types";

export const SettingsActionTypes = {
  SETTINGS_UPDATE: "SETTINGS_UPDATE",
  SETTINGS_COLUMNS_UPDATE: "SETTINGS_COLUMNS_UPDATE",
  SETTINGS_FILTERS_UPDATE: "SETTINGS_FILTERS_UPDATE"
}

export function updateSettings(payload: UpdateSettingsProps) {
  return {
    type: SettingsActionTypes.SETTINGS_UPDATE,
    payload
  }
}

export function updateColumns(payload: UpdateColumnsProps) {
  return {
    type: SettingsActionTypes.SETTINGS_COLUMNS_UPDATE,
    payload
  }
}

export function updateFilters(payload: UpdateFiltersProps) {
  return {
    type: SettingsActionTypes.SETTINGS_FILTERS_UPDATE,
    payload
  }
}