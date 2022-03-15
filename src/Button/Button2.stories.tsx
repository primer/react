import {EyeClosedIcon, EyeIcon, SearchIcon, TriangleDownIcon, XIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React, {useState} from 'react'
import {Button, ButtonProps, IconButton} from '.'
import {BaseStyles, ThemeProvider} from '..'
import Box from '../Box'

export default {
  title: 'Composite components/Button2',

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
    }
  }
} as Meta

export const defaultButton = (args: ButtonProps) => {
  return <Button {...args}>Default</Button>
}

export const primaryButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="primary">
      Primary
    </Button>
  )
}

export const dangerButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="danger">
      Danger
    </Button>
  )
}

export const invisibleButton = (args: ButtonProps) => {
  return (
    <Button {...args} variant="invisible">
      Invisible
    </Button>
  )
}

export const iconBeforeButton = (args: ButtonProps) => {
  return (
    <Button leadingIcon={SearchIcon} {...args}>
      Before
    </Button>
  )
}

export const iconButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Box mb={2}>
        <IconButton icon={XIcon} iconLabel="Close" {...args} />
      </Box>
      <Box mb={2}>
        <IconButton icon={XIcon} iconLabel="Close" {...args} variant="invisible" sx={{mt: 2}} />
      </Box>
      <Box mb={2}>
        <IconButton icon={XIcon} iconLabel="Close" {...args} variant="danger" />
      </Box>
      <Box mb={2}>
        <IconButton icon={XIcon} iconLabel="Close" {...args} variant="primary" />
      </Box>
      <Box mb={2}>
        <IconButton icon={XIcon} iconLabel="Close" {...args} variant="outline" />
      </Box>
    </>
  )
}

export const WatchCounterButton = ({...args}: ButtonProps) => {
  const [count, setCount] = useState(0)
  return (
    <>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args}>
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="primary">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="invisible">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="danger">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
      <Box mb={2}>
        <Button onClick={() => setCount(count + 1)} {...args} variant="outline">
          Watch
          <Button.Counter>{count}</Button.Counter>
        </Button>
      </Box>
    </>
  )
}

export const WatchIconButton = ({...args}: ButtonProps) => {
  const [watching, setWatching] = useState(false)
  const icon = watching ? EyeClosedIcon : () => <EyeIcon />
  return (
    <Button onClick={() => setWatching(!watching)} trailingIcon={icon} {...args}>
      Watch
    </Button>
  )
}

export const caretButton = ({...args}: ButtonProps) => {
  return (
    <Button trailingIcon={TriangleDownIcon} {...args}>
      Dropdown
    </Button>
  )
}

export const blockButton = ({...args}: ButtonProps) => {
  return (
    <Button {...args} sx={{width: '100%'}}>
      Block
    </Button>
  )
}

export const disabledButton = ({...args}: ButtonProps) => {
  return (
    <>
      <Box mb={2}>
        <Button disabled {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="danger" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="invisible" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="primary" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <Button disabled variant="outline" {...args}>
          Disabled
        </Button>
      </Box>
      <Box mb={2}>
        <IconButton disabled icon={() => <XIcon />} iconLabel="Close" {...args} />
      </Box>
    </>
  )
}

// type ReactRouterLikeLinkProps = {to: string; children: React.ReactNode}
// const ReactRouterLikeLink = forwardRef<HTMLAnchorElement, ReactRouterLikeLinkProps>(
//   ({to, ...props}: {to: string; children: React.ReactNode}, ref) => {
//     // eslint-disable-next-line jsx-a11y/anchor-has-content
//     return <a ref={ref} href={to} {...props} />
//   }
// )

// export const linkButton = ({...args}: ButtonProps) => {
//   return (
//     <>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" variant="danger" {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" variant="primary" {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" variant="outline" {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" variant="invisible" {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton href="https://primer.style/" variant="primary" trailingIcon={TriangleRightIcon} {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//       <Box mb={2} display="flex">
//         <LinkButton to="/dummy" as={ReactRouterLikeLink} variant="primary" trailingIcon={TriangleRightIcon} {...args}>
//           Link to Primer
//         </LinkButton>
//       </Box>
//     </>
//   )
// }
