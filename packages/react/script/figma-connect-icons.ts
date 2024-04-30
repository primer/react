import fs from 'fs'
import path from 'path'

/**
 * Typings for the Figma API response
 */

interface PublishedComponent {
  key: string
  file_key: string
  node_id: string
  thumbnail_url: string
  name: string
  description: string
  description_rt: string
  created_at: string
  updated_at: string
  containing_frame: {
    name: string
    nodeId: string
    pageId: string
    pageName: string
    backgroundColor: string
    containingStateGroup?: {
      name: string
      nodeId: string
    }
  }
  user: {
    id: string
    handle: string
    img_url: string
  }
}

interface PublishedFileComponentsResponse {
  error: boolean
  status: number
  meta: {
    components: PublishedComponent[]
  }
}

interface IconInfo {
  /** The figma node id */
  id: string
  /** The ComponentName of this icon */
  name: string
  /** The icon's figma layer name  */
  figmaName: string
  /** The url of the icon in figma */
  figmaUrl: string
  /** size of the icon */
  size: string
}

/**
 * --- EDIT THESE VALUES ---
 */

/**
 * The name of the Code Connect file that will be generated
 */
const ICONS_CODE_CONNECT_FILE = './src/Octicon/Octicon.figma.tsx'

/**
 * Where your icons should be imported from in your codebase
 */
const ICONS_IMPORT_PATH = '@primer/octicons-react'

/**
 * The ID/key of your figma file, for example in:
 * https://figma.com/file/ABc123IjkLmnOPq/
 *                        ^ this is the file key
 */
const FIGMA_FILE_KEY = '1ljgTFkT5NKNRfq5hw07JQ'
/**
 * -------------------------
 */

// INTERNAL ONLY REMOVE LATER
const apiUrl = process.env.API_URL || `https://api.figma.com/v1/files/`
const fileUrl = process.env.FILE_URL || `https://figma.com/file/`

/**
 * Fetch all published components from the figma file
 *
 * @returns a list of components
 */
async function fetchPublishedFileComponents() {
  if (!process.env.FIGMA_ACCESS_TOKEN) {
    throw new Error('FIGMA_ACCESS_TOKEN env variable is not set')
  }
  const url = `${apiUrl}${FIGMA_FILE_KEY}/components`
  const res = await fetch(url, {
    headers: {'X-Figma-Token': process.env.FIGMA_ACCESS_TOKEN},
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Failed to fetch ${url.toString()}: ${res.status}\n\n${txt}`)
  }
  const json = (await res.json()) as PublishedFileComponentsResponse
  return json.meta.components
}

/**
 * Gets the id and name of a figma component, and filters out
 * components that are not icons.
 *
 * @param component a published figma component
 * @returns the id and name of the component
 */
function getComponentMeta(component: PublishedComponent): {id: string; name: string} | null {
  let id = component.node_id
  let name = component.name

  // --- EDIT THIS ---
  // Edit this to select the components in figma that are icons, for
  // example this only selects components which name starts with `icon.`
  // const isIconComponent = component.name.startsWith('icon.')
  const isIconComponent = component.name

  // This part handles icons that are variants in a component set
  // and can be removed if you're using separate components for icons.
  if (!isIconComponent) {
    const stateGroup = component.containing_frame.containingStateGroup
    // const isIconVariant = stateGroup && stateGroup.name.startsWith('icon.')
    const isIconVariant = stateGroup && stateGroup.name
    if (!isIconVariant) return null

    id = stateGroup.nodeId
    name = stateGroup.name
  }

  return {id, name}
}

/**
 * Gets the URL of a figma component
 *
 * @param icon a published figma component
 * @returns a URL to the figma component
 */
function figmaUrlOfComponent(icon: PublishedComponent) {
  const nodeId = icon.containing_frame.containingStateGroup?.nodeId ?? icon.node_id
  const urlId = nodeId.replace(':', '-')
  return `${fileUrl}${icon.file_key}/?node-id=${urlId}`
}

/**
 * Writes the icons to a Code Connect file
 *
 * @param dir directory to write the file to
 * @param icons icons to write to the file
 */
async function writeCodeConnectFile(dir: string, icons: IconInfo[]) {
  const uniqueNames = new Set([...icons.map(icon => icon.name)])

  fs.writeFileSync(
    path.join(dir, ICONS_CODE_CONNECT_FILE),
    `\
import React from 'react'
import figma from '@figma/code-connect'
import {
${Array.from(uniqueNames)
  .map(iconName => `  ${iconName},`)
  .join('\n')}
} from '${ICONS_IMPORT_PATH}'
${icons
  .map(
    icon => `figma.connect(${icon.name}, '${icon.figmaUrl}', {
  example: () => <${icon.name} size={${icon.size}} />,
})`,
  )
  .join('\n')}
`,
  )
}

/**
 * Entry point for the script
 */
async function generateCodeConnectIcons() {
  const components = await fetchPublishedFileComponents()
  const icons: IconInfo[] = []

  for (const icon of components) {
    const meta = getComponentMeta(icon)
    if (!meta) continue

    const id = icon.node_id
    const figmaName = meta.name
    const figmaUrl = figmaUrlOfComponent(icon)

    // --- EDIT THIS ---
    // This is where you want to convert the figma component name to
    // a component name in your codebase. In this example, icons are
    // called e.g: `icon.32.arrow.right` and the component name then
    // becomes `IconArrowRight`
    let name = `${figmaName
      .split(/[.-]/g)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('')}Icon`

    // remove the size from the name
    name = name.replace(/[0-9]+/g, '')

    // extract the size from the name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_match, size] = figmaName.match(/([0-9]+)/) ?? [null, '16'] // default to 16 if no size specified in the Figma name

    const info: IconInfo = {
      id,
      name,
      figmaName,
      figmaUrl,
      size,
    }
    icons.push(info)
  }
  // eslint-disable-next-line no-console
  console.log(`found ${icons.length} published icons`)

  await writeCodeConnectFile('.', icons)
}

generateCodeConnectIcons()
