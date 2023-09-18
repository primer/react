import React from 'react'
import {Link as GatsbyLink} from 'gatsby'
import {Note} from '@primer/gatsby-theme-doctocat'

const DeprecationBanner = ({replacementUrl}) => {
  return (
    <Note variant="warning" sx={{marginBottom: '40px'}}>
      <strong>NOTE:</strong> The information on this page is moving to a new home. Please update your links and
      bookmarks! The new content can be found{' '}
      <GatsbyLink href={replacementUrl} target="_blank">
        here
      </GatsbyLink>
      .
    </Note>
  )
}

export default DeprecationBanner
