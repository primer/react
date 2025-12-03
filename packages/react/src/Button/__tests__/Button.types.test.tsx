import {LogoGithubIcon, StopIcon} from '@primer/octicons-react'
import {useRef} from 'react'
import {Button, IconButton} from '../../Button'

export function shouldAcceptOnlyAChildProp() {
  return <Button>child</Button>
}

export function ShouldAcceptKnownButtonPropsAndDomProps() {
  const buttonEl = useRef<HTMLButtonElement | null>(null)
  return (
    <Button
      ref={buttonEl}
      leadingVisual={() => <></>}
      trailingVisual={() => <></>}
      size="medium"
      variant="primary"
      disabled
      aria-label="Test label"
      onClick={e => {
        // current target is assignable to HTMLButtonElement
        buttonEl.current = e.currentTarget
      }}
    >
      Child
    </Button>
  )
}

export function shouldNotAcceptOutlandishProps() {
  // @ts-expect-error system props should not be accepted
  return <Button anOutlandshPropThatShouldNotBeAllowedOnA={'Button'} />
}

export function iconButtonRequiredProps() {
  return (
    <>
      <IconButton icon={StopIcon} aria-label="Stop icon" />
      <IconButton icon={StopIcon} aria-labelledby="Stop icon" />
    </>
  )
}

export function iconButtonShouldNotHaveLabelAndLabelledBy() {
  // @ts-expect-error aria-label and aria-labelledby should not be allowed together
  return <IconButton icon={StopIcon} aria-label="Stop icon" aria-labelledby="Stop icon" />
}

export function iconButtonRequiresAnIcon() {
  // @ts-expect-error icon is required
  return <IconButton aria-label="Stop icon" />
}

export function iconButtonOptionalProps() {
  return (
    <>
      <IconButton icon={StopIcon} aria-label="Stop icon" size="small" />
      <IconButton icon={StopIcon} aria-label="Stop icon" variant="danger" />
    </>
  )
}

export function iconButtonShouldNotAcceptOutlandishProps() {
  // @ts-expect-error system props should not be accepted
  return <Button icon={StopIcon} aria-label="Stop icon" anOutlandshPropThatShouldNotBeAllowedOnA={'Button'} />
}

export function supportsNoChildren() {
  return <Button />
}

export function supportsLeadingVisual() {
  return <Button leadingVisual={() => <span />}>child</Button>
}

export function supportsTrailingVisual() {
  return <Button trailingVisual={() => <span />}>child</Button>
}

export function supportsLeadingVisualElement() {
  return <Button leadingVisual={<LogoGithubIcon />}>child</Button>
}

export function supportsTrailingVisualElement() {
  return <Button trailingVisual={<LogoGithubIcon />}>child</Button>
}
