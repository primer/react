import {
  BookIcon,
  CheckIcon,
  GitBranchIcon,
  HeartIcon,
  InfoIcon,
  SearchIcon,
  TriangleDownIcon,
} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {ActionMenu} from '../ActionMenu'
import {Button} from '../Button'
import {IconButton} from '../IconButton'
import {Link} from '../Link'
import {VisuallyHidden} from '../VisuallyHidden'
import {Tooltip} from './Tooltip'

const meta = {
  title: 'React Tailwind/Components/Tooltip/Features',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const AnchorHasMargin: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip>
        <Tooltip.Trigger render={<Button className="ml-4">Button has 16px margin Left</Button>} />
        <Tooltip.Content>Tooltip is still centered</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const LabelType: Story = {
  render: () => (
    <div>
      <Tooltip type="label">
        <Tooltip.Trigger
          render={
            <Link href="https://github.com/primer/react/contributor-docs/CONTRIBUTING.md" className="ml-1 text-muted">
              <BookIcon />
            </Link>
          }
        />
        <Tooltip.Content>Contribution Documentation for &apos;Primer React&apos;</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

// As a supplementary description for a button
export const DescriptionType: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip>
        <Tooltip.Trigger render={<Button>Save</Button>} />
        <Tooltip.Content side="top">Supplementary text</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

// Pass ARIA references to the trigger, which merges them with the tooltip's own; on the rendered element they would
// replace it.
export const DescriptionTypeWithExternalDescription: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip>
        <Tooltip.Trigger aria-describedby="external-description" render={<Button>Save</Button>} />
        <Tooltip.Content side="top">Supplementary text</Tooltip.Content>
      </Tooltip>
      <VisuallyHidden id="external-description">External description</VisuallyHidden>
    </div>
  ),
}

// As a supplementary description for an IconButton, which skips its own tooltip inside one.
export const IconButtonWithDescription: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip>
        <Tooltip.Trigger render={<IconButton icon={SearchIcon} aria-label="Search" />} />
        <Tooltip.Content side="right">Supplementary text for icon button</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

const directions = [
  {label: 'North', side: 'top', align: 'center'},
  {label: 'South', side: 'bottom', align: 'center'},
  {label: 'East', side: 'right', align: 'center'},
  {label: 'West', side: 'left', align: 'center'},
  {label: 'North East', side: 'top', align: 'start'},
  {label: 'North West', side: 'top', align: 'end'},
  {label: 'Southeast', side: 'bottom', align: 'start'},
  {label: 'Southwest', side: 'bottom', align: 'end'},
] as const

export const AllDirections: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-8">
      {directions.map(({label, side, align}) => (
        <Tooltip key={label}>
          <Tooltip.Trigger render={<Button>{label}</Button>} />
          <Tooltip.Content align={align} side={side}>
            Supplementary text
          </Tooltip.Content>
        </Tooltip>
      ))}
    </div>
  ),
}

export const MultilineText: Story = {
  render: () => (
    <div>
      <Tooltip>
        <Tooltip.Trigger render={<Button>Multiline East</Button>} />
        <Tooltip.Content side="right">
          Random long text that needs to be wrapped and be multipline and have some paddings around
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const CalculatedDirection: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-8">
      <Tooltip>
        <Tooltip.Trigger render={<Button>West</Button>} />
        <Tooltip.Content side="left">
          But appears in the east direction due to not having enough space in the west
        </Tooltip.Content>
      </Tooltip>
      <Tooltip>
        <Tooltip.Trigger render={<Button>North</Button>} />
        <Tooltip.Content>
          The direction here is north by default but there is not enough space in the north therefore the tooltip
          appears in the south
        </Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

function BranchMenuContent() {
  return (
    <ActionMenu.Content width="medium">
      <ActionMenu.Item>
        <ActionMenu.LeadingVisual>
          <CheckIcon />
        </ActionMenu.LeadingVisual>
        main <ActionMenu.TrailingVisual>default</ActionMenu.TrailingVisual>
      </ActionMenu.Item>
      <ActionMenu.Item>branch-1</ActionMenu.Item>
      <ActionMenu.Item>branch-2</ActionMenu.Item>
    </ActionMenu.Content>
  )
}

// A tooltip composes with a menu trigger by rendering it, so one element owns both behaviors.
export const OnActionMenuAnchor: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-8">
      <ActionMenu>
        <Tooltip>
          <Tooltip.Trigger
            render={
              <ActionMenu.Trigger
                render={
                  <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
                    ActionMenu.Anchor w/ t
                  </Button>
                }
              />
            }
          />
          <Tooltip.Content side="top">Supplementary text to add here</Tooltip.Content>
        </Tooltip>
        <BranchMenuContent />
      </ActionMenu>
      <ActionMenu>
        <Tooltip>
          <Tooltip.Trigger
            render={<ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button w/ t</ActionMenu.Button>}
          />
          <Tooltip.Content side="top">Supplementary text to add here</Tooltip.Content>
        </Tooltip>
        <BranchMenuContent />
      </ActionMenu>
      <ActionMenu>
        <ActionMenu.Trigger
          render={
            <Button leadingVisual={GitBranchIcon} trailingAction={TriangleDownIcon}>
              ActionMenu.Anchor
            </Button>
          }
        />
        <BranchMenuContent />
      </ActionMenu>
      <ActionMenu>
        <ActionMenu.Button leadingVisual={GitBranchIcon}>ActionMenu.Button</ActionMenu.Button>
        <BranchMenuContent />
      </ActionMenu>
    </div>
  ),
}

export const KeybindingHint: Story = {
  render: () => (
    <div className="p-10">
      <Tooltip keybindingHint="Shift+?" type="label">
        <Tooltip.Trigger
          render={
            <Link href="#">
              <InfoIcon />
            </Link>
          }
        />
        <Tooltip.Content>Learn more</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const WithMediumDelay: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip delay="medium">
        <Tooltip.Trigger render={<Button>With delay</Button>} />
        <Tooltip.Content>Tooltip is delayed by 400ms</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}

export const WithLongDelay: Story = {
  render: () => (
    <div className="p-8">
      <Tooltip delay="long">
        <Tooltip.Trigger render={<IconButton icon={HeartIcon} variant="invisible" aria-label="Favorite" />} />
        <Tooltip.Content>Tooltip is delayed by 1200ms</Tooltip.Content>
      </Tooltip>
    </div>
  ),
}
