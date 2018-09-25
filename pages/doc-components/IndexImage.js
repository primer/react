import React from 'react'

const IndexImage = () => {
  let assetPrefix = ''
  if (process.env.NODE_ENV === 'production') {
    assetPrefix = 'primer-components.now.sh'
  }
  const asset = path => assetPrefix + path
  return <img alt="" src={asset('/static/assets/primer-components.svg')} />
}

export default IndexImage
