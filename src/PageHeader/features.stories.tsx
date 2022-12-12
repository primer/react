import React from 'react'
import {Meta} from '@storybook/react'
import {IconButton, ActionMenu, ActionList, Box} from '..'
import {PencilIcon, KebabHorizontalIcon, ArchiveIcon, TrashIcon} from '@primer/octicons-react'

import {PageHeader} from './PageHeader'

const meta: Meta = {
  title: 'Drafts/Components/PageHeader/Features',
  parameters: {
    layout: 'fullscreen',
    controls: {expanded: true},
  },
  args: {},
}

const PrimerViewports = {
  xsmall: {
    name: 'Xsmall',
    styles: {
      width: '320px',
      height: '100%',
    },
  },
  small: {
    name: 'Small',
    styles: {
      width: '540px',
      height: '100%',
    },
  },
  medium: {
    name: 'Medium',
    styles: {
      width: '768px',
      height: '100%',
    },
  },
  large: {
    name: 'Large',
    styles: {
      width: '1012px',
      height: '100%',
    },
  },
  xlarge: {
    name: 'Xlarge',
    styles: {
      width: '1280px',
      height: '100%',
    },
  },
  xxlarge: {
    name: 'XXlarge',
    styles: {
      width: '1400px',
      height: '100%',
    },
  },
}

export const TitleWithTrailingAction = () => (
  <Box sx={{padding: 3}}>
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
          hidden={{
            narrow: true,
            regular: false,
            wide: false,
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
  </Box>
)

TitleWithTrailingAction.parameters = {
  viewport: {
    viewports: {
      ...PrimerViewports,
    },
    defaultViewport: 'medium',
  },
}

export const TitleWithTrailingActionOnNarrowViewports = () => {
  return <TitleWithTrailingAction />
}

TitleWithTrailingActionOnNarrowViewports.parameters = {
  viewport: {
    viewports: {
      ...PrimerViewports,
    },
    defaultViewport: 'small',
  },
}

export default meta
