import {SearchIcon, TriangleDownIcon, EyeIcon, HeartFillIcon} from '@primer/octicons-react'
import {useState} from 'react'
import {Button, IconButton} from '.'
import {Stack} from '../Stack'

export default {
  title: 'Components/Button/Dev',
}

export const InvisibleVariants = () => {
  const count = 4
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button variant="invisible">Button</Button>
      <Button variant="invisible" leadingVisual={SearchIcon}>
        Button
      </Button>
      <Button variant="invisible" trailingAction={TriangleDownIcon}>
        Button
      </Button>
      <Button variant="primary" count={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} count={count}>
        Button
      </Button>
      <Button variant="invisible" leadingVisual={EyeIcon} trailingAction={TriangleDownIcon} count={count}>
        Button
      </Button>
      <IconButton icon={TriangleDownIcon} variant="invisible" aria-label="Invisible" />
    </div>
  )
}

export const DisabledButtonVariants = () => {
  return (
    <Stack direction="horizontal">
      <Stack align="start">
        <Button
          variant="invisible"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Invisible
        </Button>
        <Button
          variant="default"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Default
        </Button>
        <Button
          variant="primary"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Primary
        </Button>
        <Button
          variant="danger"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
          count={4}
          disabled
        >
          Danger
        </Button>
      </Stack>
      <Stack>
        <IconButton icon={HeartFillIcon} variant="invisible" aria-label="Invisible" disabled />
        <IconButton icon={HeartFillIcon} variant="default" aria-label="Default" disabled />
        <IconButton icon={HeartFillIcon} variant="primary" aria-label="Primary" disabled />
        <IconButton icon={HeartFillIcon} variant="danger" aria-label="Danger" disabled />
      </Stack>
    </Stack>
  )
}

export const LoadingAnnouncement = () => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Stack gap="normal" align="start">
      <p>
        With a screen reader running, activate “Export repository”. The button enters its loading state and announces
        “Exporting repository”. Reset the loading state to repeat the test.
      </p>
      <Stack direction="horizontal">
        <Button loading={isLoading} loadingAnnouncement="Exporting repository" onClick={() => setIsLoading(true)}>
          Export repository
        </Button>
        <Button disabled={!isLoading} onClick={() => setIsLoading(false)}>
          Reset loading state
        </Button>
      </Stack>
    </Stack>
  )
}

export const LinkVariantWithUnderlinePreference = () => {
  return (
    <Stack gap="spacious">
      <Stack gap="condensed" align="start" data-a11y-link-underlines="true">
        <Button variant="link">Underline pref on</Button>
        <Button
          variant="link"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
        >
          Underline pref on
        </Button>
      </Stack>
      <Stack gap="condensed" align="start" data-a11y-link-underlines="false">
        <Button variant="link">Underline pref off</Button>
        <Button
          variant="link"
          leadingVisual={SearchIcon}
          trailingAction={TriangleDownIcon}
          trailingVisual={HeartFillIcon}
        >
          Underline pref off
        </Button>
      </Stack>
    </Stack>
  )
}
