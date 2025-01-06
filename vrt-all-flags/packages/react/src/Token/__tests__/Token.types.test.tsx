import React from 'react'
import Token from '../Token'
import AvatarToken from '../AvatarToken'
import IssueLabelToken from '../IssueLabelToken'
import {CheckIcon} from '@primer/octicons-react'

export function requiresAtLeastaTextProp() {
  // @ts-expect-error text is required
  return <Token />
}

export function shouldPassWithOnlyTextProp() {
  return <Token text="Token test" />
}

export function shouldNotAcceptSystemProps() {
  // @ts-expect-error system props should not be accepted
  return <Token backgroundColor="thistle" />
}

export function acceptsAsProps() {
  return (
    <>
      <Token as="button" text="Token test" />
      <Token as="a" text="Token test" />
      <Token as="span" text="Token test" />
    </>
  )
}

export function acceptsOnRemoveProps() {
  return <Token text="Token test" onRemove={() => {}} />
}

export function acceptsHideRemoveButtonProps() {
  return <Token text="Token test" hideRemoveButton />
}

export function acceptsIsSelectedProps() {
  return <Token text="Token test" isSelected />
}

export function acceptsIdProps() {
  return <Token text="Token test" id="token-id" />
}

export function acceptsSizeProps() {
  return (
    <>
      <Token text="Token test" size="small" />
      <Token text="Token test" size="medium" />
      <Token text="Token test" size="large" />
    </>
  )
}

export function acceptsHrefProps() {
  return <Token text="Token test" as="a" href="https://github.com" />
}

export function acceptsLeadingVisualProps() {
  return <Token text="Token test" leadingVisual={CheckIcon} />
}

export function acceptsTrailingVisualProps() {
  // @ts-expect-error unUsedPropsThatAreTotallyDefinitelyNotAllowed is not a valid prop
  return <Token text="Token test" unUsedPropsThatAreTotallyDefinitelyNotAllowed={CheckIcon} />
}

export function allowsOnResizeProps() {
  return <Token text="Token test" onResize={() => {}} onResizeCapture={() => {}} />
}

export function allowsSxProp() {
  return (
    <Token
      text="Token test"
      sx={{
        backgroundColor: 'canvas.default',
      }}
    />
  )
}

export function hasReasonableEventsForTargets() {
  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = _event => {}
  const handleAnchorClick: React.MouseEventHandler<HTMLAnchorElement> = _event => {}
  const handleSpanClick: React.MouseEventHandler<HTMLSpanElement> = _event => {}
  return (
    <>
      <Token text="Token test" as="button" onClick={handleButtonClick} />
      <Token text="Token test" as="a" onClick={handleAnchorClick} />
      <Token text="Token test" as="span" onClick={handleSpanClick} />
    </>
  )
}

export function acceptsASubsetOfDomProps() {
  return (
    <>
      <Token text="Token test" className="token-class" />
      <Token text="Token test" style={{color: 'red'}} />
      <Token text="Token test" title="token-title" />
      <Token text="Token test" tabIndex={0} />
      <Token text="Token test" role="button" />
      <Token text="Token test" aria-label="Test label" />
    </>
  )
}

export function specialTokenExtensionsAcceptTheirSpecificProps() {
  return (
    <>
      <AvatarToken text="Token test" avatarSrc="https://github.com" />
      <IssueLabelToken text="Token test" fillColor="red" />
    </>
  )
}

export function specialTokenExtensionsDoNotAcceptOtherProps() {
  return (
    <>
      <AvatarToken
        text="Token test"
        // @ts-expect-error fillColor is not a valid prop for AvatarToken
        fillColor="red"
      />
      <IssueLabelToken
        text="Token test"
        // @ts-expect-error avatarSrc is not a valid prop for IssueLabelToken
        avatarSrc="https://github.com"
      />
    </>
  )
}
