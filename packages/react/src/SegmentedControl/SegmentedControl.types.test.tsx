import {LogoGithubIcon} from '@primer/octicons-react'
import {SegmentedControl} from './SegmentedControl'

export function buttonWithLeadingIconElement() {
  return (
    <SegmentedControl>
      <SegmentedControl.Button leadingVisual={<LogoGithubIcon />}>Button</SegmentedControl.Button>
    </SegmentedControl>
  )
}

export function iconButtonWithIconElement() {
  return (
    <SegmentedControl>
      <SegmentedControl.IconButton aria-label="A label" icon={<LogoGithubIcon />}>
        Button
      </SegmentedControl.IconButton>
    </SegmentedControl>
  )
}
