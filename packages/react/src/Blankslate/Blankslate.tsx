import React, {type PropsWithChildren} from 'react'
import styled from 'styled-components'
import Box from '../Box'
import {Button} from '../Button'
import Link from '../Link'
import {get} from '../constants'

export type BlankslateProps = PropsWithChildren<{
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
  container-type: inline-size;

  .Blankslate {
    --blankslate-outer-padding-block: var(--base-size-32);
    --blankslate-outer-padding-inline: var(--base-size-32);
    display: grid;
    justify-items: center;
    padding: var(--blankslate-outer-padding-block) var(--blankslate-outer-padding-inline);
  }

  .Blankslate[data-spacious='true'] {
    --blankslate-outer-padding-block: var(--base-size-80);
    --blankslate-outer-padding-inline: var(--base-size-40);
  }

  .Blankslate[data-border='true'] {
    border: var(--borderWidth-thin) solid var(--borderColor-default, ${get('colors.border.default')});
    border-radius: var(--borderRadius-medium);
  }

  .Blankslate[data-narrow='true'] {
    margin: 0 auto;
    max-width: 485px;
  }

  .Blankslate-Heading,
  .Blankslate-Description {
    margin: 0;
    margin-bottom: var(--stack-gap-condensed);
  }

  .Blankslate-Heading {
    font-size: var(--text-title-size-medium);
    font-weight: var(--text-title-weight-medium);
  }

  .Blankslate-Description {
    color: var(--fgColor-muted, ${get('colors.fg.muted')});
    font-size: var(--text-body-size-large);
  }

  .Blankslate-Action {
    margin-top: var(--stack-gap-normal);
  }

  .Blankslate-Action:first-of-type {
    margin-top: var(--stack-gap-spacious);
  }

  .Blankslate-Action:last-of-type {
    margin-bottom: var(--stack-gap-condensed);
  }
`

const BlankslateContainerQuery = `
  /* At the time these styles were written,
  34rem was our "small" breakpoint width */
  @container (max-width: 34rem) {
    ${StyledBlankslate} .Blankslate {
    --blankslate-outer-padding-block: var(--base-size-20);
    --blankslate-outer-padding-inline: var(--base-size-20);
  }

  ${StyledBlankslate} .Blankslate[data-spacious='true'] {
    --blankslate-outer-padding-block: var(--base-size-44);
    --blankslate-outer-padding-inline: var(--base-size-28);
  }

  ${StyledBlankslate} .Blankslate-Visual {
    margin-bottom: var(--stack-gap-condensed);
    max-width: var(--base-size-24);
  }

  ${StyledBlankslate} .Blankslate-Visual svg {
    width: 100%;
  }

  ${StyledBlankslate} .Blankslate-Heading {
    font-size: var(--text-title-size-small);
  }

  ${StyledBlankslate} .Blankslate-Description {
    font-size: var(--text-body-size-medium);
  }

  ${StyledBlankslate} .Blankslate-Action {
    margin-top: var(--stack-gap-condensed);
  }

  ${StyledBlankslate} .Blankslate-Action:first-of-type {
    margin-top: var(--stack-gap-normal);
  }

  ${StyledBlankslate} .Blankslate-Action:last-of-type {
    margin-bottom: calc(var(--stack-gap-condensed) / 2);
  }
`

/**
 * Blankslate is used as placeholder to tell users why content is missing.
 * @primerid blankslate
 * @primerstatus draft
 * @primera11yreviewed false
 */
export function Blankslate({border, children, narrow, spacious}: BlankslateProps) {
  return (
    <>
      {/*
        This is a workaround so we can use `@container` without upgrading `styled-components` to 6.x
        See [this comment](https://github.com/primer/react/pull/3869#discussion_r1392523030) for more info
      */}
      <style type="text/css">{BlankslateContainerQuery}</style>
      <StyledBlankslate>
        <div className="Blankslate" data-border={border} data-narrow={narrow} data-spacious={spacious}>
          {children}
        </div>
      </StyledBlankslate>
    </>
  )
}

export type VisualProps = React.PropsWithChildren

/**
 * Used to display an icon or image at the top of a Blankslate.
 * @alias Blankslate.Visual
 * @primerparentid blankslate
 */
export function Visual({children}: VisualProps) {
  return <span className="Blankslate-Visual">{children}</span>
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

/**
 * The title (heading) of the Blankslate.
 * @alias Blankslate.Heading
 * @primerparentid blankslate
 */
export function Heading({as = 'h2', children}: HeadingProps) {
  return (
    <Box as={as} className="Blankslate-Heading">
      {children}
    </Box>
  )
}

export type DescriptionProps = React.PropsWithChildren

/**
 * An optional description for the Blankslate when the title needs supplemental information.
 * @alias Blankslate.Description
 * @primerparentid blankslate
 */
export function Description({children}: DescriptionProps) {
  return <p className="Blankslate-Description">{children}</p>
}

export type PrimaryActionProps = React.PropsWithChildren<{
  /** Link to complete primary action */
  href: string
}>

/**
 * The primary action to take in response to the messaging in Blankslate.
 * @alias Blankslate.PrimaryAction
 * @primerparentid blankslate
 */
export function PrimaryAction({children, href}: PrimaryActionProps) {
  return (
    <div className="Blankslate-Action">
      <Button as="a" href={href} variant="primary">
        {children}
      </Button>
    </div>
  )
}

export type SecondaryActionProps = React.PropsWithChildren<{
  /** Link to complete secondary action */
  href: string
}>

/**
 * The secondary action to take in response to the messaging in Blankslate.
 * @alias Blankslate.SecondaryAction
 * @primerparentid blankslate
 */
export function SecondaryAction({children, href}: SecondaryActionProps) {
  return (
    <div className="Blankslate-Action">
      <Link href={href}>{children}</Link>
    </div>
  )
}
