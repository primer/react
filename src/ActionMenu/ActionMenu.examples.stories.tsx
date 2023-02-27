import React from 'react'
import {Box, ActionMenu, ActionList, Button} from '../'
import {GearIcon, MilestoneIcon, KebabHorizontalIcon} from '@primer/octicons-react'

export default {
  title: 'Components/ActionMenu/Examples',
}
export const GroupsAndDescriptions = () => {
  const milestones = [
    {name: 'FY21 - Q2', due: 'December 31, 2021', progress: 90},
    {name: 'FY22 - Q3', due: 'March 31, 2022', progress: 10},
    {name: 'FY23 - Q1', due: 'June 30, 2022', progress: 0},
    {name: 'FY23 - Q2', due: 'December 30, 2022', progress: 0},
  ]

  const [selectedMilestone, setSelectedMilestone] = React.useState<typeof milestones[0] | undefined>()

  return (
    <ActionMenu open>
      <ActionMenu.Button variant="default" trailingIcon={GearIcon}>
        Milestone
      </ActionMenu.Button>
      <ActionMenu.Overlay width="medium">
        <ActionList selectionVariant="single" showDividers>
          <ActionList.Group title="Open">
            {milestones
              .filter(milestone => !milestone.name.includes('21'))
              .map((milestone, index) => (
                <ActionList.Item
                  key={index}
                  selected={milestone.name === selectedMilestone?.name}
                  onSelect={() => setSelectedMilestone(milestone)}
                >
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  {milestone.name}
                  <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                </ActionList.Item>
              ))}
          </ActionList.Group>
          <ActionList.Group title="Closed">
            {milestones
              .filter(milestone => milestone.name.includes('21'))
              .map((milestone, index) => (
                <ActionList.Item
                  key={index}
                  selected={milestone.name === selectedMilestone?.name}
                  onSelect={() => setSelectedMilestone(milestone)}
                >
                  <ActionList.LeadingVisual>
                    <MilestoneIcon />
                  </ActionList.LeadingVisual>
                  {milestone.name}
                  <ActionList.Description variant="block">Due by {milestone.due}</ActionList.Description>
                </ActionList.Item>
              ))}
          </ActionList.Group>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  )
}

export const CustomOverlayProps = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Menu</ActionMenu.Button>
        <ActionMenu.Overlay
          width="large"
          align="center"
          onClickOutside={() => {
            /* do nothing, keep it open*/
          }}
          onEscape={() => {
            /* do nothing, keep it open*/
          }}
        >
          <ActionList>
            <ActionList.Item>Option 1</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
            <ActionList.Item>Option 2</ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </Box>
  )
}

export const ControlledMenu = () => {
  const [actionFired, fireAction] = React.useState('')
  const onSelect = (name: string) => fireAction(name)

  const [open, setOpen] = React.useState(false)
  const triggerRef = React.createRef<HTMLButtonElement>()

  return (
    <>
      <h1>Controlled Menu</h1>
      <h2>External Open State: {open ? 'Open' : 'Closed'}</h2>
      <h2>Last option activated: {actionFired}</h2>
      <div>
        <Button ref={triggerRef} onClick={() => setOpen(!open)}>
          {open ? 'Close Menu' : 'Open Menu'}
        </Button>
      </div>
      <br />

      {/**
       * Even though the state is controlled externally,
       * we can pass an Anchor for the menu to "anchor to"
       */}
      <ActionMenu open={open} onOpenChange={setOpen}>
        <ActionMenu.Button>Anchor</ActionMenu.Button>
        <ActionMenu.Overlay
          ignoreClickRefs={[
            // Because the component is controlled from outside, but the anchor is still internal,
            // clicking the external button should not be counted as "clicking outside"
            triggerRef,
          ]}
        >
          <ActionList>
            <ActionList.Item onSelect={() => onSelect('Copy link')}>
              Copy link
              <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Quote reply')}>
              Quote reply
              <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item onSelect={() => onSelect('Edit comment')}>
              Edit comment
              <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Divider />
            <ActionList.Item variant="danger" onSelect={() => onSelect('Delete file')}>
              Delete file
              <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
            </ActionList.Item>
          </ActionList>
        </ActionMenu.Overlay>
      </ActionMenu>
    </>
  )
}

export const CustomAnchor = () => (
  <ActionMenu>
    <ActionMenu.Anchor>
      <button aria-label="Open menu">
        <KebabHorizontalIcon />
      </button>
    </ActionMenu.Anchor>
    <ActionMenu.Overlay width="medium">
      <ActionList>
        <ActionList.Item onSelect={() => alert('Copy link clicked')}>
          Copy link
          <ActionList.TrailingVisual>⌘C</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Quote reply clicked')}>
          Quote reply
          <ActionList.TrailingVisual>⌘Q</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Item onSelect={() => alert('Edit comment clicked')}>
          Edit comment
          <ActionList.TrailingVisual>⌘E</ActionList.TrailingVisual>
        </ActionList.Item>
        <ActionList.Divider />
        <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
          Delete file
          <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
        </ActionList.Item>
      </ActionList>
    </ActionMenu.Overlay>
  </ActionMenu>
)
