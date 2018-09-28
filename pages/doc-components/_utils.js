import getConfig from 'next/config'

export const assetPrefix = getConfig().publicRuntimeConfig.assetPrefix || ''
export const assetPath = `${assetPrefix}/static/assets/`

export function getAssetPath(path) {
  return `${assetPath}${path}`
}
