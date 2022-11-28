import React from 'react'
import {Meta} from '@storybook/react'
import {IconButton, ActionMenu, ActionList} from '..'
import {PencilIcon, KebabHorizontalIcon, ArchiveIcon, TrashIcon} from '@primer/octicons-react'
import {PrimerViewports} from './examples.stories'

import {PageHeader} from './PageHeader'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader/Features',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true}
  },
  args: {}
}

export const TitleWithTrailingAction = () => (
  <PageHeader>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink href="http://github.com">Projects</PageHeader.ParentLink>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <PageHeader.Title>Primer Backlog</PageHeader.Title>

      <PageHeader.TrailingAction>
        <IconButton icon={PencilIcon} variant="invisible" label="Rename Title" />
      </PageHeader.TrailingAction>
      <PageHeader.Actions
        visible={{
          narrow: false,
          regular: true,
          wide: true
        }}
      >
        <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton aria-label="More Action" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>

          <ActionMenu.Overlay>
            <ActionList>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <PencilIcon />
                </ActionList.LeadingVisual>
                Rename Title
              </ActionList.Item>
              <ActionList.Item>
                <ActionList.LeadingVisual>
                  <ArchiveIcon />
                </ActionList.LeadingVisual>
                Archive all cards
              </ActionList.Item>
              <ActionList.Item variant="danger">
                <ActionList.LeadingVisual>
                  <TrashIcon />
                </ActionList.LeadingVisual>
                Delete
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>
      </PageHeader.Actions>
    </PageHeader.TitleArea>
  </PageHeader>
)

TitleWithTrailingAction.parameters = {
  viewport: {
    viewports: {
      ...PrimerViewports
    },
    defaultViewport: 'medium'
  }
}

export const TitleWithTrailingActionOnNarrowViewports = () => {
  return <TitleWithTrailingAction />
}

TitleWithTrailingActionOnNarrowViewports.parameters = {
  viewport: {
    viewports: {
      ...PrimerViewports
    },
    defaultViewport: 'small'
  }
}

// TODO: Complete the below stories

export const WithContextBar = TitleWithTrailingAction.bind({})
export const WithParentLink = TitleWithTrailingAction.bind({})
export const TitleWithLeadingVisual = TitleWithTrailingAction.bind({})
export const TitleWithLeadingAction = TitleWithTrailingAction.bind({})
export const ButtonActionOnNarrowViewports = TitleWithTrailingAction.bind({}) // New
export const ButtonActionOnRegularViewports = TitleWithTrailingAction.bind({}) // New Webhook

export default meta
