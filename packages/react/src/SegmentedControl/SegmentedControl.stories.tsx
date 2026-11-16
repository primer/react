import type {StoryFn, Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import SegmentedControlButton from './SegmentedControlButton'
import {EyeIcon, FileCodeIcon, PeopleIcon, PlusIcon} from '@primer/octicons-react'

type ResponsiveVariantOptions = 'dropdown' | 'hideLabels' | 'default' | 'subtle'
type Args = {
  size?: 'small' | 'medium'
  variant: 'default' | 'subtle'
  variantAtNarrow: ResponsiveVariantOptions
  variantAtRegular: ResponsiveVariantOptions
  variantAtWide: ResponsiveVariantOptions
  fullWidth?: boolean
  fullWidthAtNarrow?: boolean
  fullWidthAtRegular?: boolean
  fullWidthAtWide?: boolean
  showDivider?: boolean
  showAction?: boolean
}

const variantOptions = ['dropdown', 'hideLabels', 'default', 'subtle']

const parseVariantFromArgs = ({variant, variantAtNarrow, variantAtRegular, variantAtWide}: Args) =>
  variant === 'subtle'
    ? variant
    : {
        narrow: variantAtNarrow,
        regular: variantAtRegular,
        wide: variantAtWide,
      }

const parseFullWidthFromArgs = ({fullWidth, fullWidthAtNarrow, fullWidthAtRegular, fullWidthAtWide}: Args) =>
  fullWidth
    ? fullWidth
    : {
        narrow: fullWidthAtNarrow,
        regular: fullWidthAtRegular,
        wide: fullWidthAtWide,
      }

export default {
  title: 'Components/SegmentedControl',
  component: SegmentedControl,
  subcomponents: {SegmentedControlButton, SegmentedControlIconButton},
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
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium'],
    },
    variant: {
      control: {
        type: 'radio',
      },
      options: ['default', 'subtle'],
    },
    variantAtNarrow: {
      name: 'variant.narrow',
      control: {
        type: 'radio',
      },
      options: variantOptions,
    },
    variantAtRegular: {
      name: 'variant.regular',
      control: {
        type: 'radio',
      },
      options: variantOptions,
    },
    variantAtWide: {
      name: 'variant.wide',
      control: {
        type: 'radio',
      },
      options: variantOptions,
    },
    fullWidth: {
      control: {
        type: 'boolean',
      },
    },
    fullWidthAtNarrow: {
      name: 'fullWidth.narrow',
      control: {
        type: 'boolean',
      },
    },
    fullWidthAtRegular: {
      name: 'fullWidth.regular',
      control: {
        type: 'boolean',
      },
    },
    fullWidthAtWide: {
      name: 'fullWidth.wide',
      control: {
        type: 'boolean',
      },
    },
    showDivider: {
      control: {
        type: 'boolean',
      },
      name: 'divider',
    },
    showAction: {
      control: {
        type: 'boolean',
      },
      name: 'action',
    },
  },
} as Meta<typeof SegmentedControl>

export const Playground: StoryFn<Args> = args => (
  <SegmentedControl
    aria-label="File view"
    fullWidth={parseFullWidthFromArgs(args)}
    variant={parseVariantFromArgs(args)}
    size={args.size}
  >
    <SegmentedControl.Button defaultSelected aria-label={'Preview'} leadingVisual={EyeIcon}>
      Preview
    </SegmentedControl.Button>
    {args.showDivider && <SegmentedControl.Divider />}
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
    {args.showAction && <SegmentedControl.Action label="Add view" icon={PlusIcon} onClick={() => undefined} />}
  </SegmentedControl>
)

export const Default = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)
