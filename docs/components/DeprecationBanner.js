import React from 'react'
import {Link as GatsbyLink} from 'gatsby'
import {Note} from '@primer/gatsby-theme-doctocat'

const DeprecationBanner = ({replacementUrl}) => {
  return (
    <Note variant="warning" sx={{marginBottom: '40px'}}>
      This documentation is moving to a new home. Please update any link or bookmark that points to this page. The new
      content can be found <GatsbyLink href={replacementUrl}>here</GatsbyLink>.
    </Note>
  )
}

export default DeprecationBanner
