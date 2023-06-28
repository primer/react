import React from 'react'
import {ComponentStory, Meta} from '@storybook/react'

import {Box, Button, Heading, Text} from '..'
import {NavList} from '../NavList'
import {SplitPageLayout} from '../SplitPageLayout'

export default {
  title: 'Components/SplitPageLayout/Features',
  component: SplitPageLayout,
} as Meta<typeof SplitPageLayout>

export const SettingsPage: ComponentStory<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Pane position="start">
      <NavList aria-label="Main navigation">
        <NavList.Item href="#">Profile</NavList.Item>
        <NavList.Item href="#" aria-current="page">
          Account
        </NavList.Item>
        <NavList.Item href="#">Emails</NavList.Item>
        <NavList.Item href="#">Notifications</NavList.Item>
      </NavList>
    </SplitPageLayout.Pane>
    <SplitPageLayout.Content>
      <Heading as="h2" sx={{fontSize: 4, fontWeight: 'normal', color: 'danger.fg', mb: 2}}>
        Danger zone
      </Heading>
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'danger.emphasis',
          borderRadius: 2,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box sx={{display: 'grid', gap: 1}}>
          <Text sx={{fontSize: 1, fontWeight: 'bold', color: 'danger.fg'}}>Delete account</Text>
          <Text sx={{fontSize: 1, color: 'fg.muted'}}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </Text>
        </Box>
        <Button variant="danger">Delete account</Button>
      </Box>
    </SplitPageLayout.Content>
  </SplitPageLayout>
)
