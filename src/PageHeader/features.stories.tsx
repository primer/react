import React from 'react'
import {Meta, Story} from '@storybook/react'
import {Button, IconButton, ActionMenu, ActionList} from '..'
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Template: Story = args => (
//   <PageHeader>
//     <PageHeader.ContextArea visible={args.hasContextArea}>
//       <PageHeader.ParentLink
//         href="http://github.com"
//         visible={{
//           narrow: args.hasParentLink,
//           regular: args.hasParentLink,
//           wide: args.hasParentLink
//         }}
//       >
//         {args.ParentLink}
//       </PageHeader.ParentLink>

//       <PageHeader.ContextBar visible={args.hasContextBar}>
//         {/* <Breadcrumbs>
//           <Breadcrumbs.Item href="#">...</Breadcrumbs.Item>
//           <Breadcrumbs.Item href="#">primer</Breadcrumbs.Item>
//           <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
//           <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
//           <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
//           <Breadcrumbs.Item href="#">PageHeader.tsx</Breadcrumbs.Item>
//         </Breadcrumbs> */}
//       </PageHeader.ContextBar>

//       <PageHeader.ContextAreaActions
//         visible={{
//           narrow: args.hasContextAreaAction,
//           regular: args.hasContextAreaAction,
//           wide: args.hasContextAreaAction
//         }}
//       >
//         <Button size="small" leadingIcon={GitBranchIcon}>
//           Main
//         </Button>
//         <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
//       </PageHeader.ContextAreaActions>
//     </PageHeader.ContextArea>
//     <PageHeader.TitleArea>
//       <PageHeader.LeadingAction
//         visible={{
//           narrow: args.hasLeadingAction,
//           regular: args.hasLeadingAction,
//           wide: args.hasLeadingAction
//         }}
//       >
//         <IconButton icon={SidebarExpandIcon} variant="invisible" />{' '}
//       </PageHeader.LeadingAction>
//       <PageHeader.LeadingVisual
//         visible={{
//           narrow: args.hasLeadingVisual,
//           regular: args.hasLeadingVisual,
//           wide: args.hasLeadingVisual
//         }}
//       >
//         {<args.LeadingVisual />}
//       </PageHeader.LeadingVisual>
//       <PageHeader.Title
//         as={args['Title.as']}
//         variant={{
//           narrow: args['Title.variant'],
//           regular: args['Title.variant'],
//           wide: args['Title.variant']
//         }}
//         visible={args.hasTitle}
//       >
//         {args.Title}
//       </PageHeader.Title>
//       <PageHeader.TrailingVisual
//         visible={{
//           narrow: args.hasTrailingVisual,
//           regular: args.hasTrailingVisual,
//           wide: args.hasTrailingVisual
//         }}
//       >
//         <Label>Beta</Label>
//       </PageHeader.TrailingVisual>
//       <PageHeader.TrailingAction
//         visible={{
//           narrow: args.hasTrailingAction,
//           regular: args.hasTrailingAction,
//           wide: args.hasTrailingAction
//         }}
//       >
//         <IconButton icon={PencilIcon} variant="invisible" />
//       </PageHeader.TrailingAction>
//       <PageHeader.Actions visible={args.hasActions}>
//         <Hidden on={['narrow']}>
//           <Button variant="primary">New Branch</Button>
//         </Hidden>

//         <Hidden on={['regular', 'wide', 'narrow']}>
//           <Button variant="primary">New</Button>
//         </Hidden>
//         <IconButton aria-label="More" icon={KebabHorizontalIcon} />
//       </PageHeader.Actions>
//     </PageHeader.TitleArea>
//   </PageHeader>
// )

// export const TitleWithTrailingVisual = Template.bind({})

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
