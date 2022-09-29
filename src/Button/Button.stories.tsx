import {
  EyeClosedIcon,
  EyeIcon,
  SearchIcon,
  TriangleDownIcon,
  XIcon,
  TriangleRightIcon,
  HeartIcon
} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React, {useState, forwardRef} from 'react'
import {Button, ButtonProps, IconButton} from '.'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'

const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}

const actionIcons = {unset, TriangleDownIcon}

export default {
  title: 'Composite components/Button',

  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    }
  ],
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['small', 'medium', 'large']
      }
    },
    disabled: {
      control: {
        type: 'boolean'
      }
    },
    variant: {
      control: {
        type: 'radio',
        options: ['default', 'primary', 'danger', 'invisible', 'outline']
      }
    },
    alignContent: {
      control: {
        type: 'radio',
        options: ['center', 'start']
      }
    },
    block: {
      control: {
        type: 'boolean'
      }
    },
    leadingIcon: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingIcon: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(icons)
      },
      mapping: icons
    },
    trailingAction: {
      description: 'The displayed icon on the left',
      control: {
        type: 'select',
        options: Object.keys(actionIcons)
      },
      mapping: actionIcons
    }
  },
  args: {
    block: false,
    size: 'medium',
    disabled: false,
    variant: 'default',
    alignContent: 'center',
    trailingIcon: null,
    leadingIcon: null,
    trailingAction: null
  }
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => <Button {...args}>Default</Button>

// const Playground = args => <Button {...args} />

// export const Playground = (args: ButtonProps) => {
//   return <Button {...args}>Default</Button>
// }

export const Default = Playground.bind({})
Default.args = {
  variant: 'default'
}

export const Primary = Playground.bind({})
Primary.args = {
  variant: 'primary'
}

export const Danger = Playground.bind({})
Danger.args = {
  variant: 'danger'
}

export const Invisible = Playground.bind({})
Invisible.args = {
  variant: 'invisible'
}

export const LeadingVisual = Playground.bind({})
LeadingVisual.args = {
  leadingIcon: HeartIcon
}

export const TrailingVisual = Playground.bind({})
TrailingVisual.args = {
  trailingIcon: HeartIcon
}

export const TrailingAction = Playground.bind({})
TrailingAction.args = {
  trailingAction: TriangleDownIcon
}

export const Block = Playground.bind({})
Block.args = {
  block: true
}

export const Disabled = Playground.bind({})
Disabled.args = {
  disabled: true
}

export const TrailingCounter = ({...args}: ButtonProps) => {
  const [count, setCount] = useState(0)
  return (
    <Button onClick={() => setCount(count + 1)} {...args}>
      Watch
      <Button.Counter>{count}</Button.Counter>
    </Button>
  )
}

export const iconButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Box mb={2}>
        <IconButton icon={XIcon} aria-label="Close" {...args} />
      </Box>
    </>
  )
}

// export const WatchIconButton = ({...args}: ButtonProps) => {
//   const [watching, setWatching] = useState(false)
//   const icon = watching ? EyeClosedIcon : () => <EyeIcon />
//   return (
//     <Button onClick={() => setWatching(!watching)} trailingIcon={icon} {...args}>
//       Watch
//     </Button>
//   )
// }

// export const caretButton = ({...args}: ButtonProps) => {
//   return (
//     <Button trailingIcon={TriangleDownIcon} {...args}>
//       Dropdown
//     </Button>
//   )
// }

type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
  ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return <a ref={ref} href={to} {...props} />
  }
)

export const linkButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" {...args}>
          Link to Primer
        </Button>
      </Box>
      <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" variant="danger" {...args}>
          Link to Primer
        </Button>
      </Box>
      <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" variant="primary" {...args}>
          Link to Primer
        </Button>
      </Box>
      <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" variant="outline" {...args}>
          Link to Primer
        </Button>
      </Box>
      <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" variant="invisible" {...args}>
          Link to Primer
        </Button>
      </Box>
      {/* <Box mb={2} display="flex">
        <Button as="a" href="https://primer.style/" variant="primary" trailingIcon={TriangleRightIcon} {...args}>
          Link to Primer
        </Button>
      </Box> */}
      {/* <Box mb={2} display="flex">
        <Button to="/dummy" as={ReactRouterLikeLink} variant="primary" trailingIcon={TriangleRightIcon} {...args}>
          Link to Primer
        </Button>
      </Box> */}
    </>
  )
}
