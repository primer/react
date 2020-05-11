import {BorderBox, Grid, Link} from '@primer/components'
import Contributors from '@primer/gatsby-theme-doctocat/src/components/contributors'
import {PencilIcon} from '@primer/styled-octicons'
import React from 'react'

function PageFooter({editUrl, contributors}) {
  return editUrl || contributors.length > 0 ? (
    <BorderBox borderWidth={0} borderRadius={0} borderTopWidth={1} mt={8} py={5}>
      <Grid gridGap={4}>
        {editUrl ? (
          <Link href={editUrl}>
            <PencilIcon mr={2} />
            Edit this page on GitHub
          </Link>
        ) : null}

        {contributors.length > 0 ? <Contributors contributors={contributors} /> : null}
      </Grid>
    </BorderBox>
  ) : null
}

PageFooter.defaultProps = {
  contributors: []
}

export default PageFooter
