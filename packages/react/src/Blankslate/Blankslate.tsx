import React from 'react'
import Box from '../Box'
import {Button} from '../Button'
import Link from '../Link'
import {get} from '../constants'
import styled from 'styled-components'
import classes from './Blankslate.module.css'

export type BlankslateProps = React.PropsWithChildren<{
  /**
   * Add a border around this component
   */
  border?: boolean

  /**
   * Constrain the maximum width of this component
   */
  narrow?: boolean

  /**
   * Increase the padding of this component
   */
  spacious?: boolean
}>

function Blankslate({border, children, narrow, spacious}: BlankslateProps) {
  return (
    <>
      <div className={classes.container}>
        <div className={classes.blankslate} data-border={border} data-narrow={narrow} data-spacious={spacious}>
          {children}
        </div>
      </div>
    </>
  )
}

export type VisualProps = React.PropsWithChildren

function Visual({children}: VisualProps) {
  return <span className={classes.visual}>{children}</span>
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

function Heading({as = 'h2', children}: HeadingProps) {
  return (
    <Box as={as} className={classes.heading}>
      {children}
    </Box>
  )
}

export type DescriptionProps = React.PropsWithChildren

function Description({children}: DescriptionProps) {
  return <p className={classes.description}>{children}</p>
}

export type PrimaryActionProps = React.PropsWithChildren<{
  href: string
}>

function PrimaryAction({children, href}: PrimaryActionProps) {
  return (
    <div className={classes.action}>
      <Button as="a" href={href} variant="primary">
        {children}
      </Button>
    </div>
  )
}

export type SecondaryActionProps = React.PropsWithChildren<{
  href: string
}>

function SecondaryAction({children, href}: SecondaryActionProps) {
  return (
    <div className={classes.action}>
      <Link href={href}>{children}</Link>
    </div>
  )
}

export default Object.assign(Blankslate, {
  Visual,
  Heading,
  Description,
  PrimaryAction,
  SecondaryAction,
})
