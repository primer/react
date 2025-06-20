import {Avatar, Box, CounterLabel, Heading, Label, SideNav, Text} from '../..'
import type {Meta} from '@storybook/react-vite'
import type {ComponentProps} from '../../utils/types'
import Octicon from '../../Octicon'
import {DotIcon, MailIcon, PersonIcon, SmileyIcon, ZapIcon} from '@primer/octicons-react'

export default {
  title: 'Deprecated/Components/SideNav/Dev',
  component: SideNav,
} as Meta<ComponentProps<typeof SideNav>>

export const Default = () => (
  <SideNav bordered aria-label="Main">
    <SideNav.Link href="#account">
      <Text>Account</Text>
    </SideNav.Link>
    <SideNav.Link href="#home" selected>
      <Text>Profile</Text>
    </SideNav.Link>
    <SideNav.Link href="#emails">
      <Text>Emails</Text>
    </SideNav.Link>
    <SideNav.Link href="#notifications">
      <Text>Notifications</Text>
    </SideNav.Link>
  </SideNav>
)

export const FullVariant = () => (
  <SideNav bordered aria-label="Main">
    <SideNav.Link href="#url">
      <Text>Text Only</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Avatar size={16} src="https://avatars.githubusercontent.com/hubot?s=32" />
      <Text>With an avatar</Text>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Octicon size={16} icon={ZapIcon} />
      <Text>With an Octicon</Text>
    </SideNav.Link>
    <SideNav.Link href="#url" variant="full" selected>
      <Text>With a status icon</Text>
      <Octicon size={16} icon={DotIcon} color="success.fg" />
    </SideNav.Link>
    <SideNav.Link href="#url" variant="full">
      <Text>With a label</Text>
      <Label>label</Label>
    </SideNav.Link>
    <SideNav.Link href="#url" variant="full">
      <Text>With a counter</Text>
      <CounterLabel>16</CounterLabel>
    </SideNav.Link>
    <SideNav.Link href="#url">
      <Heading as="h5">A heading</Heading>
      <Text>and some more content</Text>
    </SideNav.Link>
  </SideNav>
)

export const LightweightVariant = () => (
  <Box
    borderWidth="1px"
    borderStyle="solid"
    borderColor="border.default"
    borderRadius={2}
    p={3}
    backgroundColor="canvas.subtle"
    maxWidth={360}
  >
    <Box
      borderStyle="solid"
      borderColor="border.default"
      borderWidth={0}
      borderBottomWidth={1}
      borderRadius={0}
      mb={2}
      pb={1}
    >
      <Heading as="h2" color="fg.muted">
        Menu
      </Heading>
    </Box>
    <SideNav variant="lightweight">
      <SideNav.Link href="#url">
        <Text>Account</Text>
      </SideNav.Link>
      <SideNav.Link href="#url" selected>
        <Text>Profile</Text>
      </SideNav.Link>
      <SideNav.Link href="#url">
        <Text>Emails</Text>
      </SideNav.Link>
      <SideNav.Link href="#url">
        <Text>Notifications</Text>
      </SideNav.Link>
    </SideNav>
  </Box>
)

export const LightweightNestedVariant = () => (
  <SideNav bordered aria-label="Main">
    <SideNav.Link href="#url">
      <Octicon size={16} icon={PersonIcon} />
      <Text>Account</Text>
    </SideNav.Link>
    <SideNav.Link href="#url" selected>
      <Octicon size={16} icon={SmileyIcon} />
      <Text>Profile</Text>
    </SideNav.Link>

    <SideNav bordered variant="lightweight">
      <SideNav.Link href="#url" selected>
        <Text>Sub item 1</Text>
      </SideNav.Link>
      <SideNav.Link href="#url">
        <Text>Sub item 2</Text>
      </SideNav.Link>
      <SideNav.Link href="#url">
        <Text>Sub item 3</Text>
      </SideNav.Link>
    </SideNav>

    <SideNav.Link href="#url">
      <Octicon size={16} icon={MailIcon} />
      <Text>Emails</Text>
    </SideNav.Link>
  </SideNav>
)
