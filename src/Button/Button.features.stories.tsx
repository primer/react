import {EyeIcon, TriangleDownIcon, HeartIcon} from '@primer/octicons-react'
import React, {useState} from 'react'
import {Button} from '.'
import {Tooltip} from '../drafts'
import {ToggleSwitch, Text, Box, Dialog} from '../'

export default {
  title: 'Components/Button/Features',
}

export const Primary = () => <Button variant="primary">Primary</Button>

export const Danger = () => <Button variant="danger">Danger</Button>

export const Invisible = () => <Button variant="invisible">Invisible</Button>

export const LeadingVisual = () => <Button leadingVisual={HeartIcon}>Leading visual</Button>

export const TrailingVisual = () => <Button trailingVisual={EyeIcon}>Trailing visual</Button>

export const TrailingCounter = () => {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)} count={count}>
      Watch
    </Button>
  )
}

export const TrailingCounterAllVariants = () => {
  const [count, setCount] = useState(0)
  return (
    <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <Button onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="primary" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="primary" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="danger" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="danger" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="invisible" onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
      <Button variant="invisible" disabled onClick={() => setCount(count + 1)} count={count}>
        Watch
      </Button>
    </div>
  )
}

export const TrailingAction = () => <Button trailingAction={TriangleDownIcon}>Trailing action</Button>

export const Block = () => <Button block>Default</Button>

export const Disabled = () => <Button disabled>Default</Button>

export const Inactive = () => (
  <Button variant="primary" inactive>
    Default
  </Button>
)

export const Small = () => <Button size="small">Default</Button>

export const Medium = () => <Button size="medium">Default</Button>

export const Large = () => <Button size="large">Default</Button>

const InactiveButtonHover = () => <Button inactive>Hover over me during outage</Button>

export const InactiveButtonWithTooltip = () => {
  const [isOn, setIsOn] = React.useState(false)
  const onClick = React.useCallback(() => {
    setIsOn(!isOn)
  }, [setIsOn, isOn])

  return (
    <Box>
      <Text id="toggle" fontWeight={'bold'} fontSize={2}>
        Simulate outage
      </Text>
      <ToggleSwitch aria-labelledby="toggle" onClick={onClick} />
      {isOn ? (
        <Tooltip text="This button is inactive due to an outage!">
          <InactiveButtonHover />
        </Tooltip>
      ) : (
        <InactiveButtonHover />
      )}
    </Box>
  )
}

export const InactiveButtonShowsDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const onDialogClose = React.useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])
  const onAnchorClick = React.useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])
  return (
    <Box>
      <Button inactive onClick={onAnchorClick}>
        Click on me during outage
      </Button>
      {isOpen && (
        <Dialog title="My Dialog" subtitle="This is a subtitle!" onClose={onDialogClose}>
          There is an outage so you cant read whats supposed to be here
        </Dialog>
      )}
    </Box>
  )
}
