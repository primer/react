import {EyeIcon, TriangleDownIcon, HeartIcon, DownloadIcon, CommentIcon} from '@primer/octicons-react'
import {useState} from 'react'
import {Button} from '.'
import {Stack} from '../Stack/Stack'
import {announce} from '@primer/live-region-element'
import {Tooltip} from '../TooltipV2/Tooltip'
export default {
  title: 'Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const Link = () => <Button variant="link">Button that looks like a link</Button>

export const LeadingVisual = () => <Button leadingVisual={HeartIcon}>Leading visual</Button>

export const TrailingVisual = () => <Button trailingVisual={EyeIcon}>Trailing visual</Button>

const AccessibilityNote = () => {
  {
    return (
      <>
        <p>
          <b>Accessibility note</b>: If a button is dynamically updated to communicate a change (e.g. an action was
          successful), please make sure that this is also properly communicated to screen reader users. This may not
          happen reliably without additional markup considerations. Make sure to choose an approach that is appropriate
          for your usecase.
        </p>
        <p>
          Learn more about at{' '}
          <a
            style={{color: 'var(--fgColor-link)', textDecoration: 'underline'}}
            href="https://github.com/github/accessibility/blob/8b300b36d8bca28fd5e3e70ffa077a6f8ee65c05/docs/wiki/screen-reader-testing/dynamically-updated-buttons-support-april-2024.md"
          >
            Staff-only: Dynamically updated button labels
          </a>
          .
        </p>
      </>
    )
  }
}
export const TrailingCounter = () => {
  const [count, setCount] = useState(0)
  const onClick = () => {
    setCount(count + 1)
    announce(`Watch ${count + 1}`)
  }
  return (
    <>
      <Button onClick={onClick} count={count}>
        Watch
      </Button>
      <AccessibilityNote />
      <p>In this example, a live region has been implemented to communicate the change.</p>
    </>
  )
}

export const TrailingCounterWithNoText = () => <Button aria-label="Comments" leadingVisual={CommentIcon} count={3} />

export const TrailingCounterWithHumanFormat = () => (
  <Button aria-label="Comments" leadingVisual={CommentIcon} count="3.2k" />
)

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  const onClick = () => {
    setCount(count + 1)
    announce(`Watch ${count + 1}`)
  }
  return (
    <>
      <Stack gap="normal" wrap="wrap" direction="horizontal">
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="primary" disabled count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="danger" count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="danger" disabled count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="invisible" count={count}>
          Watch
        </Button>
        <Button onClick={onClick} variant="invisible" disabled count={count}>
          Watch
        </Button>
      </Stack>
      <AccessibilityNote />
      <p>In these examples, a live region has been implemented to communicate the change.</p>
    </>
  )
}

export const TrailingAction = () => <Button trailingAction={TriangleDownIcon}>Trailing action</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => (
  <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
    <Button disabled>Default</Button>
    <Button variant="primary" disabled>
      Primary
    </Button>
    <Button variant="danger" disabled>
      Danger
    </Button>
    <Button variant="invisible" disabled>
      Invisible
    </Button>
  </div>
)

export const Inactive = () => (
  <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
    <Button inactive>Default</Button>
    <Button variant="primary" inactive>
      Primary
    </Button>
    <Button variant="danger" inactive>
      Danger
    </Button>
    <Button variant="invisible" inactive>
      Invisible
    </Button>
  </div>
)

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>

export const Loading = () => <Button loading>Default</Button>

export const LoadingCustomAnnouncement = () => (
  <Button loading loadingAnnouncement="This is a custom loading announcement">
    Default
  </Button>
)

export const LoadingWithLeadingVisual = () => (
  <Button loading leadingVisual={DownloadIcon}>
    Export
  </Button>
)

export const LoadingWithTrailingVisual = () => (
  <Button loading trailingVisual={DownloadIcon}>
    Export
  </Button>
)

export const LoadingWithTrailingAction = () => (
  <Button loading trailingAction={TriangleDownIcon}>
    Export dropdown
  </Button>
)

export const LoadingTrigger = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
  }

  return (
    <Button loading={isLoading} onClick={handleClick} leadingVisual={DownloadIcon}>
      Export
    </Button>
  )
}

export const LabelWrap = () => {
  return (
    <Stack style={{width: '200px'}}>
      <Button labelWrap>This button label will wrap if the label is too long</Button>
      <Button size="small" labelWrap>
        This small button label will wrap if the label is too long
      </Button>
      <Button size="large" labelWrap>
        This large button label will wrap if the label is too long
      </Button>
      <Button labelWrap leadingVisual={HeartIcon} trailingVisual={EyeIcon}>
        This button label will wrap if the label is too long
      </Button>
    </Stack>
  )
}

export const InactiveButtonWithTooltip = () => (
  <Tooltip text="Action unavailable: an error occurred while loading repository permissions" direction="n">
    <Button inactive>Review changes</Button>
  </Tooltip>
)

export const ExpandedButton = () => (
  <Stack align="start">
    <Button aria-expanded trailingAction={TriangleDownIcon}>
      Review changes
    </Button>
    <Button aria-expanded trailingAction={TriangleDownIcon} variant="primary">
      Review changes
    </Button>
    <Button aria-expanded trailingAction={TriangleDownIcon} variant="invisible">
      Review changes
    </Button>
    <Button aria-expanded trailingAction={TriangleDownIcon} variant="danger">
      Review changes
    </Button>
  </Stack>
)

export const KeybindingHint = () => <Button keybindingHint="Mod+S">Save</Button>

export const KeybindingHintAllVariants = () => (
  <Stack>
    <Stack gap="normal" wrap="wrap" direction="horizontal">
      <Button keybindingHint="Mod+S">Default</Button>
      <Button disabled keybindingHint="Mod+S">
        Default disabled
      </Button>
      <Button inactive keybindingHint="Mod+S">
        Default inactive
      </Button>
    </Stack>
    <Stack gap="normal" wrap="wrap" direction="horizontal">
      <Button variant="primary" keybindingHint="Mod+S">
        Primary
      </Button>
      <Button variant="primary" disabled keybindingHint="Mod+S">
        Primary disabled
      </Button>
      <Button variant="primary" inactive keybindingHint="Mod+S">
        Primary inactive
      </Button>
    </Stack>
    <Stack gap="normal" wrap="wrap" direction="horizontal">
      <Button variant="danger" keybindingHint="Mod+S">
        Danger
      </Button>
      <Button variant="danger" disabled keybindingHint="Mod+S">
        Danger disabled
      </Button>
      <Button variant="danger" inactive keybindingHint="Mod+S">
        Danger inactive
      </Button>
    </Stack>
    <Stack gap="normal" wrap="wrap" direction="horizontal">
      <Button variant="invisible" keybindingHint="Mod+S">
        Invisible
      </Button>
      <Button variant="invisible" disabled keybindingHint="Mod+S">
        Invisible disabled
      </Button>
      <Button variant="invisible" inactive keybindingHint="Mod+S">
        Invisible inactive
      </Button>
    </Stack>
  </Stack>
)

export const KeybindingHintAllSizes = () => (
  <Stack gap="normal" wrap="wrap" direction="horizontal">
    <Button size="small" keybindingHint="Mod+S">
      Save
    </Button>
    <Button size="medium" keybindingHint="Mod+S">
      Save
    </Button>
    <Button size="large" keybindingHint="Mod+S">
      Save
    </Button>
  </Stack>
)

export const KeybindingHintWithLeadingVisual = () => (
  <Button leadingVisual={DownloadIcon} keybindingHint="Mod+D">
    Download
  </Button>
)

export const KeybindingHintPriority = () => (
  <Stack gap="normal" wrap="wrap" direction="horizontal" align="start">
    <Stack gap="condensed">
      <Button keybindingHint="Mod+S">Only keybindingHint</Button>
      <p style={{margin: 0, fontSize: '12px', color: 'var(--fgColor-muted)'}}>Shows keybinding hint</p>
    </Stack>
    <Stack gap="condensed">
      <Button count={3} keybindingHint="Mod+S">
        Count priority
      </Button>
      <p style={{margin: 0, fontSize: '12px', color: 'var(--fgColor-muted)'}}>Count takes priority</p>
    </Stack>
    <Stack gap="condensed">
      <Button trailingVisual={EyeIcon} keybindingHint="Mod+S">
        TrailingVisual priority
      </Button>
      <p style={{margin: 0, fontSize: '12px', color: 'var(--fgColor-muted)'}}>TrailingVisual takes priority</p>
    </Stack>
  </Stack>
)

export const KeybindingHintSequence = () => (
  <Button variant="primary" keybindingHint="G N">
    Go to notifications
  </Button>
)

export const KeybindingHintComplexChords = () => (
  <Stack gap="normal" wrap="wrap" direction="horizontal">
    <Button keybindingHint="Control+Shift+P">Command palette</Button>
    <Button variant="primary" keybindingHint="Mod+K">
      Search
    </Button>
    <Button keybindingHint="Alt+ArrowUp">Move up</Button>
  </Stack>
)

export const KeybindingHintWithLoading = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000000)
  }

  return (
    <Button variant="primary" keybindingHint="Mod+Enter" loading={isLoading} onClick={handleClick}>
      Submit
    </Button>
  )
}
