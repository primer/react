import type {Meta} from '@storybook/react-vite'
import {INITIAL_VIEWPORTS} from 'storybook/viewport'
import UnderlinePanels from './UnderlinePanels'
import type {ComponentProps} from '../../utils/types'
import {
  CodeIcon,
  CommentDiscussionIcon,
  EyeIcon,
  GearIcon,
  GitPullRequestIcon,
  GraphIcon,
  PlayIcon,
  ProjectIcon,
  ShieldLockIcon,
} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/UnderlinePanels/Features',
  component: UnderlinePanels,
} as Meta<ComponentProps<typeof UnderlinePanels>>

export const SelectedTab = () => (
  <UnderlinePanels aria-label="Select a tab" id="tab-panels">
    <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab aria-selected={true}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const LabelledByExternalElement = () => (
  <>
    <h2 id="my-heading">UnderlinePanels example</h2>
    <UnderlinePanels aria-labelledby="my-heading">
      <UnderlinePanels.Tab>Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Tab>Tab 3</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
    </UnderlinePanels>
  </>
)

export const WithIcons = () => (
  <UnderlinePanels aria-label="Tabs with icons">
    <UnderlinePanels.Tab icon={CodeIcon}>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
  </UnderlinePanels>
)

export const WithIconsHiddenOnNarrowScreen = () => (
  <UnderlinePanels aria-label="Tabs with icons">
    <UnderlinePanels.Tab icon={CodeIcon}>Tab 1</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={EyeIcon}>Tab 2</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GitPullRequestIcon}>Tab 3</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={CommentDiscussionIcon}>Tab 4</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={PlayIcon}>Tab 5</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ProjectIcon}>Tab 6</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GraphIcon}>Tab 7</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={GearIcon}>Tab 8</UnderlinePanels.Tab>
    <UnderlinePanels.Tab icon={ShieldLockIcon}>Tab 9</UnderlinePanels.Tab>
    <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 3</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 4</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 5</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 6</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 7</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 8</UnderlinePanels.Panel>
    <UnderlinePanels.Panel>Panel 9</UnderlinePanels.Panel>
  </UnderlinePanels>
)

WithIconsHiddenOnNarrowScreen.parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      narrowScreen: {
        name: 'Narrow Screen',
        styles: {
          width: '800px',
          height: '100%',
        },
      },
    },
    defaultViewport: 'narrowScreen',
  },
}

export const WithCounters = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters">
      <UnderlinePanels.Tab counter="11K">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}

export const WithCountersInLoadingState = () => {
  return (
    <UnderlinePanels aria-label="Tabs with counters" loadingCounters>
      <UnderlinePanels.Tab counter="11K">Tab 1</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={12}>Tab 2</UnderlinePanels.Tab>
      <UnderlinePanels.Panel>Panel 1</UnderlinePanels.Panel>
      <UnderlinePanels.Panel>Panel 2</UnderlinePanels.Panel>
    </UnderlinePanels>
  )
}
