import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon, HeartIcon} from '@primer/octicons-react'
import {Story, Meta} from '@storybook/react'
import React, {forwardRef} from 'react'
import {Button, ButtonProps, IconButton} from '.'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'

const unset = undefined
const icons = {unset, EyeClosedIcon, EyeIcon, SearchIcon, XIcon, HeartIcon}

const actionIcons = {unset, TriangleDownIcon}

export default {
  title: 'Components/Button',
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
    },
    trailingVisualCount: {
      description: 'The displayed icon on the left',
      control: {
        type: 'number'
      }
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
    trailingAction: null,
    trailingVisualCount: null
  }
} as Meta<typeof Button>

export const Playground: Story<typeof Button> = args => <Button {...args}>Default</Button>

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

// type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
// const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
//   ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
//     // eslint-disable-next-line jsx-a11y/anchor-has-content
//     return <a ref={ref} href={to} {...props} />
//   }
// )

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
