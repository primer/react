import React from 'react'
import {Button, IconButton, Breadcrumbs} from '../..'
import {PageHeader} from '../../PageHeader'
import {Tooltip} from './Tooltip'
import {GitBranchIcon, KebabHorizontalIcon} from '@primer/octicons-react'

export default {
  title: 'Experimental/Components/Tooltip/Examples',
  component: Tooltip,
}

export const FilesPage = () => (
  <PageHeader>
    <PageHeader.ContextArea>
      <PageHeader.ParentLink>Files</PageHeader.ParentLink>
      <PageHeader.ContextAreaActions>
        <Tooltip text="The file content is based on the main branch.">
          <Button size="small" leadingIcon={GitBranchIcon}>
            Main
          </Button>
        </Tooltip>
        <Tooltip text="More files actions" type="label">
          <IconButton size="small" aria-label="More" icon={KebabHorizontalIcon} />
        </Tooltip>
      </PageHeader.ContextAreaActions>
    </PageHeader.ContextArea>
    <PageHeader.TitleArea>
      <Breadcrumbs>
        <Breadcrumbs.Item href="#">...</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">primer</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">PageHeader.tsx</Breadcrumbs.Item>
      </Breadcrumbs>
    </PageHeader.TitleArea>
  </PageHeader>
)

FilesPage.parameters = {
  viewport: {
    defaultViewport: 'small',
  },
}
