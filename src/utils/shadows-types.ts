export interface Shadows {
  shadow: Shadow
  state: State
  autocomplete: Autocomplete
  btn: Btn
  dropdown: Autocomplete
  overlay: Autocomplete
  input: Autocomplete
  avatar: Avatar
  toast: Autocomplete
  selectMenu: Autocomplete
}

export interface Autocomplete {
  shadow: string
}

export interface Avatar {
  childShadow: string
}

export interface Btn {
  shadow: string
  insetShadow: string
  focusShadow: string
  shadowActive: string
  shadowInputFocus: string
  primary: Primary
  outline: Danger
  danger: Danger
}

export interface Danger {
  hoverShadow: string
  hoverInsetShadow: string
  selectedShadow: string
  focusShadow: string
}

export interface Primary {
  shadow: string
  insetShadow: string
  selectedShadow: string
  focusShadow: string
}

export interface Shadow {
  small: string
  medium: string
  large: string
  extraLarge: string
  highlight: string
  inset: string
}

export interface State {
  focus: Autocomplete
}
