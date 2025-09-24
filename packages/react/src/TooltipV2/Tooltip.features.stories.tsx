import {IconButton, Button, Link, ActionMenu, ActionList, VisuallyHidden} from '..'
import Octicon from '../Octicon'
import {Tooltip, type TooltipDirection} from './Tooltip'
import {
  SearchIcon,
  BookIcon,
  CheckIcon,
  TriangleDownIcon,
  GitBranchIcon,
  InfoIcon,
  StarIcon,
  HeartIcon,
} from '@primer/octicons-react'
import classes from './Tooltip.features.stories.module.css'

export default {
  title: 'Components/TooltipV2/Features',
  component: Tooltip,
}

export const AnchorHasMargin = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="Tooltip is still centered">
      <Button className={classes.MarginLeftButton}>Button has 16px margin Left</Button>
    </Tooltip>
  </div>
)

export const LabelType = () => (
  <div>
    <Tooltip text="Contribution Documentation for 'Primer React'" type="label">
      <Link href="https://github.com/primer/react/contributor-docs/CONTRIBUTING.md" className={classes.LabelLink}>
        <Octicon icon={BookIcon} className={classes.LabelIcon} />
      </Link>
    </Tooltip>
  </div>
)

// As a supplementary description for a button
export const DescriptionType = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="Supplementary text" direction="n">
      <Button>Save</Button>
    </Tooltip>
  </div>
)

// As a supplementary description for a button
export const DescriptionTypeWithExternalDescription = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="Supplementary text" direction="n">
      <Button aria-describedby="external-description">Save</Button>
    </Tooltip>
    <VisuallyHidden id="external-description">External description</VisuallyHidden>
  </div>
)

// As a supplementary description for an IconButton
export const IconButtonWithDescription = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="Supplementary text for icon button" direction="e">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>
  </div>
)

export const AllDirections = () => (
  <div className={classes.AllDirectionsRow}>
    <Tooltip direction="n" text="Supplementary text">
      <Button>North</Button>
    </Tooltip>
    <Tooltip direction="s" text="Supplementary text">
      <Button>South</Button>
    </Tooltip>
    <Tooltip direction="e" text="Supplementary text">
      <Button>East</Button>
    </Tooltip>
    <Tooltip direction="w" text="Supplementary text">
      <Button>West</Button>
    </Tooltip>
    <Tooltip direction="ne" text="Supplementary text">
      <Button>North East</Button>
    </Tooltip>
    <Tooltip direction="nw" text="Supplementary text">
      <Button>North West</Button>
    </Tooltip>
    <Tooltip direction="se" text="Supplementary text">
      <Button>Southeast</Button>
    </Tooltip>
    <Tooltip direction="sw" text="Supplementary text">
      <Button>Southwest</Button>
    </Tooltip>
  </div>
)

export const MultilineText = () => (
  <div>
    <Tooltip
      direction="e"
      text="Random long text that needs to be wrapped and be multipline and have some paddings around"
    >
      <Button>Multiline East</Button>
    </Tooltip>
  </div>
)

export const CalculatedDirection = () => (
  <div className={classes.AllDirectionsRow}>
    <Tooltip direction="w" text="But appears in the east direction due to not having enough space in the west">
      <Button>West</Button>
    </Tooltip>

    <Tooltip text="The direction here is north by default but there is not enough space in the north therefore the tooltip appears in the south">
      <Button>North</Button>
    </Tooltip>
  </div>
)

export const OnActionMenuAnchor = () => (
  <div className={classes.ActionMenuRow}>
    <ActionMenu>
      <ActionMenu.Anchor>
        <Tooltip text="Supplementary text to add here" direction="n">
          <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
            ActionMenu.Anchor w/ t
          </Button>
        </Tooltip>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <Tooltip text="Supplementary text to add here" direction="n">
        <ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button w/ t</ActionMenu.Button>
      </Tooltip>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <ActionMenu.Anchor>
        <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
          ActionMenu.Anchor
        </Button>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
    <ActionMenu>
      <ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button</ActionMenu.Button>

      <ActionMenu.Overlay width="medium">
        <ActionList>
          <ActionList.Item onSelect={() => alert('Main')}>
            <ActionList.LeadingVisual>
              <CheckIcon />
            </ActionList.LeadingVisual>
            main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
          </ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
          <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  </div>
)

export const KeybindingHint = () => (
  <div className={classes.KeybindingHintContainer}>
    <Tooltip text="Learn more" keybindingHint="Shift+?" type="label">
      <Link href="#">
        <InfoIcon />
      </Link>
    </Tooltip>
  </div>
)

export const WithDelay = () => (
  <div className={classes.PaddedContainer}>
    <Tooltip text="Tooltip is delayed by 600ms" delay={600}>
      <Button>With delay</Button>
    </Tooltip>
  </div>
)

export const OcticonPicker = {
  args: {
    delay: 300,
  },
  argTypes: {
    delay: {
      control: {
        type: 'number',
        min: 0,
        max: 2000,
        step: 50,
      },
      description: 'Delay in milliseconds before showing the tooltip',
    },
    direction: {
      control: {
        type: 'select',
      },
      options: ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'],
      description: 'Direction of the tooltip',
    },
  },
  render: ({delay, direction}: {delay: number; direction: TooltipDirection}) => {
    const octicons = [
      {icon: SearchIcon, name: 'Search'},
      {icon: BookIcon, name: 'Book'},
      {icon: CheckIcon, name: 'Check'},
      {icon: StarIcon, name: 'Star'},
      {icon: HeartIcon, name: 'Heart'},
      {icon: SearchIcon, name: 'Search'},
      {icon: BookIcon, name: 'Book'},
      {icon: CheckIcon, name: 'Check'},
      {icon: StarIcon, name: 'Star'},
      {icon: HeartIcon, name: 'Heart'},
      {icon: SearchIcon, name: 'Search'},
      {icon: BookIcon, name: 'Book'},
      {icon: CheckIcon, name: 'Check'},
      {icon: StarIcon, name: 'Star'},
      {icon: HeartIcon, name: 'Heart'},
    ]

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '4px',
          maxWidth: '200px',
          padding: '16px',
        }}
      >
        {octicons.map((octicon, index) => (
          <Tooltip key={index} text={octicon.name} direction={direction} delay={delay}>
            <IconButton
              aria-label={octicon.name}
              // eslint-disable-next-line no-console
              onClick={() => console.log(`Selected ${octicon.name}`)}
              icon={octicon.icon}
            />
          </Tooltip>
        ))}
      </div>
    )
  },
}
