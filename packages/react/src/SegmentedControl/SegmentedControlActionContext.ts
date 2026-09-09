import {createContext} from 'react'

export const SegmentedControlActionContext = createContext<'inline' | 'menu'>('inline')
