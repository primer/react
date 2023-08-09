import React from 'react'
import {Button, IconButton, Breadcrumbs, ActionMenu, ActionList} from '../..'
import {PageHeader} from '../../PageHeader'
import {Tooltip} from './Tooltip'
import {GitBranchIcon, KebabHorizontalIcon, TriangleDownIcon, CheckIcon} from '@primer/octicons-react'
import {default as VisuallyHidden} from '../../_VisuallyHidden'

export default {
  title: 'Experimental/Components/Tooltip/Examples',
  component: Tooltip,
}

export const FilesPage = () => (
  <PageHeader>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        {/* <ActionMenu>
          <Tooltip text="Overflow menu">
            <ActionMenu.Button size="small" leadingIcon={GitBranchIcon}>
              ActionMenu.Button
            </ActionMenu.Button>
          </Tooltip>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Main')}>
                <ActionList.LeadingVisual>
                  <CheckIcon />
                </ActionList.LeadingVisual>
                main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
        <ActionMenu>
          <ActionMenu.Anchor>
            {/* ref issue occurs here */}
            <Tooltip text="Overflow menu">
              <Button size="small" leadingIcon={GitBranchIcon} trailingAction={TriangleDownIcon}>
                ActionMenu.Anchor-t
              </Button>
            </Tooltip>
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Main')}>
                <ActionList.LeadingVisual>
                  <CheckIcon />
                </ActionList.LeadingVisual>
                main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>

        {/* <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group title="Raw file content">
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group title="View Options">
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <Breadcrumbs>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">PageHeader</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/blob/main/src/PageHeader/PageHeader.tsx">
          PageHeader.tsx
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <VisuallyHidden as="h2">PageHeader.tsx</VisuallyHidden>
      <PageHeader.Actions hidden={{narrow: true}}>
        {/* <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group title="Raw file content">
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group title="View Options">
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
      </PageHeader.Actions>
    </PageHeader.TitleArea>
  </PageHeader>
)

export const FilesPage2 = () => (
  <PageHeader>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        {/* <ActionMenu>
          <Tooltip text="Overflow menu">
            <ActionMenu.Button size="small" leadingIcon={GitBranchIcon}>
              ActionMenu.Button
            </ActionMenu.Button>
          </Tooltip>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Main')}>
                <ActionList.LeadingVisual>
                  <CheckIcon />
                </ActionList.LeadingVisual>
                main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
        <ActionMenu>
          <ActionMenu.Anchor>
            {/* ref issue occurs here */}
            {/* <Tooltip text="Overflow menu"> */}
            <Button size="small" leadingIcon={GitBranchIcon} trailingAction={TriangleDownIcon}>
              ActionMenu.Anchor
            </Button>
            {/* </Tooltip> */}
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Item onSelect={() => alert('Main')}>
                <ActionList.LeadingVisual>
                  <CheckIcon />
                </ActionList.LeadingVisual>
                main <ActionList.TrailingVisual>default</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 1')}>branch-1</ActionList.Item>
              <ActionList.Item onSelect={() => alert('Branch 2')}>branch-2</ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu>

        {/* <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group title="Raw file content">
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group title="View Options">
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <Breadcrumbs>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main">react</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src">src</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/tree/main/src/PageHeader">PageHeader</Breadcrumbs.Item>
        <Breadcrumbs.Item href="https://github.com/primer/react/blob/main/src/PageHeader/PageHeader.tsx">
          PageHeader.tsx
        </Breadcrumbs.Item>
      </Breadcrumbs>
      <VisuallyHidden as="h2">PageHeader.tsx</VisuallyHidden>
      <PageHeader.Actions hidden={{narrow: true}}>
        {/* <ActionMenu>
          <ActionMenu.Anchor>
            <IconButton size="small" aria-label="More file actions" icon={KebabHorizontalIcon} />
          </ActionMenu.Anchor>
          <ActionMenu.Overlay width="medium">
            <ActionList>
              <ActionList.Group title="Raw file content">
                <ActionList.Item onSelect={() => alert('Download')}>Download</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Jump to line')}>
                Jump to line
                <ActionList.TrailingVisual>L</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Item onSelect={() => alert('Copy path')}>
                Copy path
                <ActionList.TrailingVisual>⌘⇧.</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Item onSelect={() => alert('Copy permalink')}>
                Copy permalink
                <ActionList.TrailingVisual>⌘⇧,</ActionList.TrailingVisual>
              </ActionList.Item>
              <ActionList.Divider />
              <ActionList.Group title="View Options">
                <ActionList.Item onSelect={() => alert('Show code folding buttons')}>
                  Show code folding buttons
                </ActionList.Item>
                <ActionList.Item onSelect={() => alert('Wrap lines')}>Wrap lines</ActionList.Item>
                <ActionList.Item onSelect={() => alert('Center content')}>Center content</ActionList.Item>
              </ActionList.Group>
              <ActionList.Divider />
              <ActionList.Item variant="danger" onSelect={() => alert('Delete file clicked')}>
                Delete file
                <ActionList.TrailingVisual>⌘D</ActionList.TrailingVisual>
              </ActionList.Item>
            </ActionList>
          </ActionMenu.Overlay>
        </ActionMenu> */}
      </PageHeader.Actions>
    </PageHeader.TitleArea>
  </PageHeader>
)
FilesPage.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}

FilesPage2.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}
