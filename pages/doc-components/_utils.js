import getConfig from 'next/config'

export const assetPath = `${getConfig().publicRuntimeConfig.assetPrefix || ''}/static/assets/`

export function getAssetPath(path) {
  return `${assetPath}${path}`
}
