import React from 'react'

const IndexImage = () => {
  let assetPrefix = ''
  const nowData = global.__NOW_DATA__
  if (nowData) {
    assetPrefix = nowData.assetPrefix
  }
  const asset = path => assetPrefix + path
  return <img alt="" src={asset('/static/assets/primer-components.png')} />
}

export default IndexImage
