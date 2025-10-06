import type {StoryFn, Meta} from '@storybook/react-vite'

import {Button, Heading, Text} from '..'
import {NavList} from '../NavList'
import {SplitPageLayout} from '../SplitPageLayout'
import classes from './SplitPageLayout.features.stories.module.css'

export default {
  title: 'Components/SplitPageLayout/Features',
  component: SplitPageLayout,
} as Meta<typeof SplitPageLayout>

export const SettingsPage: StoryFn<typeof SplitPageLayout> = () => (
  <SplitPageLayout>
    <SplitPageLayout.Pane position="start" aria-label="Navigation Pane">
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
      <Heading as="h2" className={classes.SectionHeading}>
        Danger zone
      </Heading>
      <div className={classes.DeleteAccountContainer}>
        <div className={classes.DeleteAccountTextContainer}>
          <Text className={classes.DeleteAccountTitle}>Delete account</Text>
          <Text className={classes.DeleteAccountDescription}>
            Are you sure you don&apos;t want to just downgrade your account to a free account? We won&apos;t charge your
            credit card anymore.
          </Text>
        </div>
        <Button variant="danger">Delete account</Button>
      </div>
    </SplitPageLayout.Content>
  </SplitPageLayout>
)
