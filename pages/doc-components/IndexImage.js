import React from 'react'

class IndexImage extends React.Component {
  render() {
    let assetPrefix = ''
    const nowData = global.__NOW_DATA__
    if (nowData) {
      assetPrefix = nowData.assetPrefix
    }
    const asset = path => assetPrefix + path
    return (
      <img src={asset('/static/assets/primer-components.png')} />
    )
  }
}


export default IndexImage
