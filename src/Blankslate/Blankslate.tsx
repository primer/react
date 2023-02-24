import React from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {Button} from '../Button'
import {get} from '../constants'
import Link from '../Link'

const StyledBlankslate = styled.div`
  display: grid;
  justify-items: center;
  padding: ${get('space.5')};

  &[data-border='true'] {
    border: ${get('borderWidths.1')} solid ${get('colors.border.default')};
    border-radius: ${get('radii.2')};
  }

  &[data-narrow='true'] {
    margin: 0 auto;
    max-width: 485px;
  }

  &[data-spacious='true'] {
    padding: ${get('space.9')} ${get('space.6')};
  }

  .BlankSlateAction {
    margin-top: ${get('space.3')};
  }

  .BlankSlateAction:first-of-type {
    margin-top: ${get('space.4')};
  }

  .BlankSlateAction:last-of-type {
    margin-bottom: ${get('space.2')};
  }
`

export interface BlankslateProps extends React.PropsWithChildren {
  /**
   * Add a border around this component
   */
  border?: boolean | undefined

  /**
   * Constrain the maximum width of this component
   */
  narrow?: boolean | undefined

  /**
   * Increase the padding of this component
   */
  spacious?: boolean | undefined
}

function Blankslate({border, children, narrow, spacious}: BlankslateProps) {
  return (
    <StyledBlankslate data-border={border} data-narrow={narrow} data-spacious={spacious}>
      {children}
    </StyledBlankslate>
  )
}

export interface VisualProps extends React.PropsWithChildren {}

function Visual({children}: VisualProps) {
  return <Box sx={{color: 'fg.muted', mb: 3}}>{children}</Box>
}

export interface HeadingProps extends React.PropsWithChildren {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | undefined
}

function Heading({as = 'h2', children}: HeadingProps) {
  return (
    <Box as={as} sx={{m: 0, mb: 2}}>
      {children}
    </Box>
  )
}

export interface DescriptionProps extends React.PropsWithChildren {}

function Description({children}: DescriptionProps) {
  return (
    <Box as="p" sx={{color: 'fg.muted', m: 0, mb: 2}}>
      {children}
    </Box>
  )
}

export interface PrimaryActionProps extends React.PropsWithChildren {
  href: string
}

function PrimaryAction({children, href}: PrimaryActionProps) {
  return (
    <div className="BlankSlateAction">
      <Button as="a" href={href} variant="primary">
        {children}
      </Button>
    </div>
  )
}

export interface SecondaryActionProps extends React.PropsWithChildren {
  href: string
}

function SecondaryAction({children, href}: SecondaryActionProps) {
  return (
    <div className="BlankSlateAction">
      <Link href={href}>{children}</Link>
    </div>
  )
}

export {Blankslate, Visual, Heading, Description, PrimaryAction, SecondaryAction}
