import {BorderBox, Grid, Link, StyledOcticon} from '@primer/components'
import {Pencil} from '@primer/octicons-react'
import React from 'react'
import Contributors from '@primer/gatsby-theme-doctocat/src/components/contributors'

function PageFooter({editUrl, contributors}) {
  return editUrl || contributors.length > 0 ? (
    <BorderBox borderWidth={0} borderRadius={0} borderTopWidth={1} mt={8} py={5}>
      <Grid gridGap={4}>
        {editUrl ? (
          <Link href={editUrl}>
            <StyledOcticon icon={Pencil} mr={2} />
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
