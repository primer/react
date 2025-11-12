const lightThemes = ['light', 'light_high_contrast', 'light_colorblind', 'light_tritanopia'] as const

type LightTheme = (typeof lightThemes)[number]

const darkThemes = ['dark', 'dark_dimmed', 'dark_high_contrast', 'dark_colorblind', 'dark_tritanopia'] as const

type DarkTheme = (typeof darkThemes)[number]

const themes = [...lightThemes, ...darkThemes]

type Theme = (typeof themes)[number]

type ColorMode = 'light' | 'dark' | 'auto'

type ThemeOptions = {
  colorMode?: ColorMode
  lightTheme?: LightTheme
  darkTheme?: DarkTheme
}

function updateGlobalTheme(theme: Theme) {
  if (lightThemes.includes(theme as LightTheme)) {
    document.documentElement.setAttribute('data-color-mode', 'light')
    document.documentElement.setAttribute('data-light-theme', theme)
  } else {
    document.documentElement.setAttribute('data-color-mode', 'dark')
    document.documentElement.setAttribute('data-dark-theme', theme)
  }
}

export {themes, updateGlobalTheme}
