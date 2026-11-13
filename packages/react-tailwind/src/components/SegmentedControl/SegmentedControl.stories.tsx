import {EyeIcon, FileCodeIcon, PeopleIcon, PlusIcon} from '@primer/octicons-react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SegmentedControl, type SegmentedControlVariant} from './SegmentedControl'
const meta = {
  title: 'React Tailwind/Forms/SegmentedControl',
  component: SegmentedControl,
  subcomponents: {
    'SegmentedControl.Button': SegmentedControl.Button,
    'SegmentedControl.IconButton': SegmentedControl.IconButton,
  },
} satisfies Meta<typeof SegmentedControl>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: () => (
    <SegmentedControl defaultValue={['preview']} aria-label="File view">
      <SegmentedControl.Button value="preview">Preview</SegmentedControl.Button>
      <SegmentedControl.Button value="raw">Raw</SegmentedControl.Button>
      <SegmentedControl.Button value="blame">Blame</SegmentedControl.Button>
    </SegmentedControl>
  ),
}

interface PlaygroundArgs {
  size?: 'small' | 'medium'
  variant: 'default' | 'subtle'
  variantAtNarrow: SegmentedControlVariant
  variantAtRegular: SegmentedControlVariant
  variantAtWide: SegmentedControlVariant
  fullWidth?: boolean
  fullWidthAtNarrow?: boolean
  fullWidthAtRegular?: boolean
  fullWidthAtWide?: boolean
  showDivider?: boolean
  showAction?: boolean
}

const variantOptions: SegmentedControlVariant[] = ['dropdown', 'hideLabels', 'default', 'subtle']

const parseVariantFromArgs = ({variant, variantAtNarrow, variantAtRegular, variantAtWide}: PlaygroundArgs) =>
  variant === 'subtle' ? variant : {narrow: variantAtNarrow, regular: variantAtRegular, wide: variantAtWide}

const parseFullWidthFromArgs = ({fullWidth, fullWidthAtNarrow, fullWidthAtRegular, fullWidthAtWide}: PlaygroundArgs) =>
  fullWidth ? fullWidth : {narrow: fullWidthAtNarrow, regular: fullWidthAtRegular, wide: fullWidthAtWide}

export const Playground: StoryObj<PlaygroundArgs> = {
  args: {
    size: 'medium',
    variant: 'default',
    variantAtNarrow: 'default',
    variantAtRegular: 'default',
    variantAtWide: 'default',
    fullWidth: false,
    fullWidthAtNarrow: false,
    fullWidthAtRegular: false,
    fullWidthAtWide: false,
    showDivider: false,
    showAction: false,
  },
  argTypes: {
    size: {control: 'radio', options: ['small', 'medium']},
    variant: {control: 'radio', options: ['default', 'subtle']},
    variantAtNarrow: {name: 'variant.narrow', control: 'radio', options: variantOptions},
    variantAtRegular: {name: 'variant.regular', control: 'radio', options: variantOptions},
    variantAtWide: {name: 'variant.wide', control: 'radio', options: variantOptions},
    fullWidth: {control: 'boolean'},
    fullWidthAtNarrow: {name: 'fullWidth.narrow', control: 'boolean'},
    fullWidthAtRegular: {name: 'fullWidth.regular', control: 'boolean'},
    fullWidthAtWide: {name: 'fullWidth.wide', control: 'boolean'},
    showDivider: {name: 'divider', control: 'boolean'},
    showAction: {name: 'action', control: 'boolean'},
  },
  render: args => (
    <SegmentedControl
      aria-label="File view"
      defaultValue={['preview']}
      fullWidth={parseFullWidthFromArgs(args)}
      size={args.size}
      variant={parseVariantFromArgs(args)}
    >
      <SegmentedControl.Button value="preview" leadingVisual={EyeIcon}>
        Preview
      </SegmentedControl.Button>
      {args.showDivider && <SegmentedControl.Divider />}
      <SegmentedControl.Button value="raw" leadingVisual={FileCodeIcon}>
        Raw
      </SegmentedControl.Button>
      <SegmentedControl.Button value="blame" leadingVisual={PeopleIcon}>
        Blame
      </SegmentedControl.Button>
      {args.showAction && <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={() => undefined} />}
    </SegmentedControl>
  ),
}
