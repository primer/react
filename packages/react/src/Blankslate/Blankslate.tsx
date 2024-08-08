import cx from 'clsx'
import React from 'react'
import Box from '../Box'
import {Button} from '../Button'
import Link from '../Link'
import {get} from '../constants'
import styled from 'styled-components'
import classes from './Blankslate.module.css'
import {useFeatureFlag} from '../FeatureFlags'

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
  container-type: inline-size;

  .Blankslate {
    --blankslate-outer-padding-block: var(--base-size-32, 2rem);
    --blankslate-outer-padding-inline: var(--base-size-32, 2rem);

    display: grid;
    justify-items: center;
    padding: var(--blankslate-outer-padding-block) var(--blankslate-outer-padding-inline);
  }

  .Blankslate[data-spacious='true'] {
    --blankslate-outer-padding-block: var(--base-size-80, 5rem);
    --blankslate-outer-padding-inline: var(--base-size-40, 2.5rem);
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
    margin-bottom: var(--stack-gap-condensed, 0.5rem);
  }

  .Blankslate-Heading {
    font-size: var(--text-title-size-medium, 1.25rem);
    font-weight: var(--text-title-weight-medium, 600);
  }

  .Blankslate-Description {
    color: var(--fgColor-muted, ${get('colors.fg.muted')});
    font-size: var(--text-body-size-large, 1rem);
    line-height: var(--text-body-lineHeight-large, 1.5);
  }

  .Blankslate-Action {
    margin-top: var(--stack-gap-normal, 1rem);
  }

  .Blankslate-Action:first-of-type {
    margin-top: var(--stack-gap-spacious, 1.5rem);
  }

  .Blankslate-Action:last-of-type {
    margin-bottom: var(--stack-gap-condensed, 0.5rem);
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
    margin-bottom: var(--stack-gap-condensed, 0.5rem);
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
    margin-top: var(--stack-gap-condensed, 0.5rem);
  }

  ${StyledBlankslate} .Blankslate-Action:first-of-type {
    margin-top: var(--stack-gap-normal, 1rem);
  }

  ${StyledBlankslate} .Blankslate-Action:last-of-type {
    margin-bottom: calc(var(--stack-gap-condensed, 0.5rem) / 2);
  }
`

function Blankslate({border, children, narrow, spacious}: BlankslateProps) {
  const enabled = useFeatureFlag('primer_react_css_modules')

  if (enabled) {
    return (
      <div className={classes.Container}>
        <div className={classes.Blankslate} data-border={border} data-narrow={narrow} data-spacious={spacious}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <>
      {/*
        This is a workaround so we can use `@container` without upgrading `styled-components` to 6.x
        See [this comment](https://github.com/primer/react/pull/3869#discussion_r1392523030) for more info
      */}
      <style type="text/css" dangerouslySetInnerHTML={{__html: BlankslateContainerQuery}} />
      <StyledBlankslate>
        <div className="Blankslate" data-border={border} data-narrow={narrow} data-spacious={spacious}>
          {children}
        </div>
      </StyledBlankslate>
    </>
  )
}

export type VisualProps = React.PropsWithChildren

function Visual({children}: VisualProps) {
  const enabled = useFeatureFlag('primer_react_css_modules')
  return (
    <span
      className={cx('Blankslate-Visual', {
        [classes.Visual]: enabled,
      })}
    >
      {children}
    </span>
  )
}

export type HeadingProps = React.PropsWithChildren<{
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}>

function Heading({as = 'h2', children}: HeadingProps) {
  const enabled = useFeatureFlag('primer_react_css_modules')
  return (
    <Box
      as={as}
      className={cx('Blankslate-Heading', {
        [classes.Heading]: enabled,
      })}
    >
      {children}
    </Box>
  )
}

export type DescriptionProps = React.PropsWithChildren

function Description({children}: DescriptionProps) {
  const enabled = useFeatureFlag('primer_react_css_modules')
  return (
    <p
      className={cx('Blankslate-Description', {
        [classes.Description]: enabled,
      })}
    >
      {children}
    </p>
  )
}

export type PrimaryActionProps = React.PropsWithChildren<{
  href: string
}>

function PrimaryAction({children, href}: PrimaryActionProps) {
  const enabled = useFeatureFlag('primer_react_css_modules')
  return (
    <div
      className={cx('Blankslate-Action', {
        [classes.Action]: enabled,
      })}
    >
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
  const enabled = useFeatureFlag('primer_react_css_modules')
  return (
    <div
      className={cx('Blankslate-Action', {
        [classes.Action]: enabled,
      })}
    >
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
