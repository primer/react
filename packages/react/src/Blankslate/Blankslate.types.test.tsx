import {useRef} from 'react'
import {Blankslate} from '../Blankslate'

export function ActionAcceptsButtonProps() {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Blankslate>
      <Blankslate.Action
        ref={buttonRef}
        onClick={event => {
          buttonRef.current = event.currentTarget
        }}
      >
        Action
      </Blankslate.Action>
    </Blankslate>
  )
}

export function ActionAcceptsLinkProps() {
  const linkRef = useRef<HTMLAnchorElement | null>(null)

  return (
    <Blankslate>
      <Blankslate.Action
        as="a"
        href="https://github.com"
        ref={linkRef}
        onClick={event => {
          linkRef.current = event.currentTarget
        }}
      >
        Action
      </Blankslate.Action>
    </Blankslate>
  )
}

export function secondaryActionAcceptsButtonProps() {
  return (
    <Blankslate>
      <Blankslate.SecondaryAction as="button" onClick={() => {}}>
        Action
      </Blankslate.SecondaryAction>
    </Blankslate>
  )
}

export function secondaryActionAcceptsLinkProps() {
  return (
    <Blankslate>
      <Blankslate.SecondaryAction href="https://github.com">Action</Blankslate.SecondaryAction>
    </Blankslate>
  )
}

export function actionShouldOnlyAcceptValidVariants() {
  return (
    <Blankslate>
      {/* @ts-expect-error variant should be either primary or secondary */}
      <Blankslate.Action variant="default">Action</Blankslate.Action>
    </Blankslate>
  )
}

export function actionShouldOnlyAcceptButtonOrAnchorElements() {
  return (
    <Blankslate>
      {/* @ts-expect-error as prop should be button or anchor */}
      <Blankslate.Action as="div">Action</Blankslate.Action>
    </Blankslate>
  )
}
