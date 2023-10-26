import React from 'react'
import Box from '../Box'
import {Button} from '../Button'
import Link from '../Link'
import {get} from '../constants'
import classNames from './blankslate.module.css'
import styled from 'styled-components'

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

const StyledBlankslate = styled.div`
  --borderColor-default-local-fallback: ${get('colors.border.default')};
  --fgColor-muted-local-fallback: ${get('colors.fg.muted')};
  container-type: inline-size;
`

function Blankslate({border, children, narrow, spacious}: BlankslateProps) {
  return (
    <StyledBlankslate>
      <div className={classNames.Blankslate} data-border={border} data-narrow={narrow} data-spacious={spacious}>
        {children}
      </div>
    </StyledBlankslate>
  )
}

export type VisualProps = React.PropsWithChildren

function Visual({children}: VisualProps) {
  return <span className={classNames['Blankslate-Visual']}>{children}</span>
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

function Heading({as = 'h2', children}: HeadingProps) {
  return (
    <Box as={as} className={classNames['Blankslate-Heading']}>
      {children}
    </Box>
  )
}

export type DescriptionProps = React.PropsWithChildren

function Description({children}: DescriptionProps) {
  return <p className={classNames['Blankslate-Description']}>{children}</p>
}

export type PrimaryActionProps = React.PropsWithChildren<{
  href: string
}>

function PrimaryAction({children, href}: PrimaryActionProps) {
  return (
    <div className={classNames['Blankslate-Action']}>
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
    <div className={classNames['Blankslate-Action']}>
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
