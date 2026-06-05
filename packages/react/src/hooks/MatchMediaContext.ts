import {createContext} from 'react'

export type MediaQueryFeatures = {
  [key: string]: boolean | undefined
}

// Used to keep track of overrides to specific media query features, this should
// be used for development and demo purposes to emulate specific features if
// unavailable through devtools
export const MatchMediaContext = createContext<MediaQueryFeatures>({})
