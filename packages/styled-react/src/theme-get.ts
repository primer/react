import {themeGet} from '@styled-system/theme-get'
// eslint-disable-next-line import/no-namespace
import * as styledSystem from 'styled-system'
import {theme} from '@primer/react'

const {get: getKey} = styledSystem

export const get = (key: string) => themeGet(key, getKey(theme, key))
