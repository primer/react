import type {StoryFn, Meta} from '@storybook/react-vite'
import {SegmentedControl} from '.'
import SegmentedControlIconButton from './SegmentedControlIconButton'
import SegmentedControlButton from './SegmentedControlButton'
import {EyeIcon, FileCodeIcon, PeopleIcon} from '@primer/octicons-react'

type ResponsiveVariantOptions = 'dropdown' | 'hideLabels' | 'default'
type Args = {
  fullWidth?: boolean
  fullWidthAtNarrow?: boolean
  fullWidthAtRegular?: boolean
  fullWidthAtWide?: boolean
  size?: 'small' | 'medium'
  variantAtNarrow: ResponsiveVariantOptions
  variantAtRegular: ResponsiveVariantOptions
  variantAtWide: ResponsiveVariantOptions
}

const excludedControlKeys = ['variant']

const variantOptions = ['dropdown', 'hideLabels', 'default']

const parseVariantFromArgs = ({variantAtNarrow, variantAtRegular, variantAtWide}: Args) => ({
  narrow: variantAtNarrow,
  regular: variantAtRegular,
  wide: variantAtWide,
})

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
    fullWidth: false,
    fullWidthAtNarrow: false,
    fullWidthAtRegular: false,
    fullWidthAtWide: false,
    size: 'medium',
    variantAtNarrow: 'default',
    variantAtRegular: 'default',
    variantAtWide: 'default',
  },
  argTypes: {
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
    size: {
      control: {
        type: 'radio',
      },
      options: ['small', 'medium'],
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
  },
  parameters: {controls: {exclude: excludedControlKeys}},
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
    <SegmentedControl.Button aria-label={'Raw'} leadingVisual={FileCodeIcon}>
      Raw
    </SegmentedControl.Button>
    <SegmentedControl.Button aria-label={'Blame'} leadingVisual={PeopleIcon}>
      Blame
    </SegmentedControl.Button>
  </SegmentedControl>
)

export const Default = () => (
  <SegmentedControl aria-label="File view">
    <SegmentedControl.Button defaultSelected>Preview</SegmentedControl.Button>
    <SegmentedControl.Button>Raw</SegmentedControl.Button>
    <SegmentedControl.Button>Blame</SegmentedControl.Button>
  </SegmentedControl>
)
