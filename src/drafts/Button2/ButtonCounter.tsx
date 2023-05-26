import React from 'react'
import CounterLabel from '../../CounterLabel'
import {SxProp} from '../../sx'
import {defaultSxProp} from '../../utils/defaultSxProp'

export type CounterProps = {
  children: number
} & SxProp

const Counter = ({children, sx: sxProp = defaultSxProp, ...props}: CounterProps) => {
  // we need to make sure we add the sx styles to the css selector that has the highest specificity.
  const cssSelector = `&[data-component="ButtonCounter"]`

  const counterButtonStyles = {
    [cssSelector]: sxProp,
  }
  return (
    <CounterLabel data-component="ButtonCounter" sx={{ml: 2, ...counterButtonStyles}} {...props}>
      {children}
    </CounterLabel>
  )
}

export {Counter}
