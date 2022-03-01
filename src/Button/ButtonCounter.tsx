import React from 'react'
import {SxProp} from '../sx'
import CounterLabel from '../CounterLabel'

export type CounterProps = {
  children: number
} & SxProp

const Counter = ({children, sx: sxProp = {}, ...props}: CounterProps) => {
  return (
    <CounterLabel data-component="ButtonCounter" sx={{ml: 2, ...sxProp}} {...props}>
      {children}
    </CounterLabel>
  )
}

export {Counter}
