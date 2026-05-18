import {createRequire} from 'node:module'
import {formatKeyValueTable, formatTable} from './table.js'

interface Icon {
  readonly name: string
  readonly exportName: string
  readonly importPath: string
}

interface IconInfo {
  readonly icon: Icon
  readonly docsUrl: string
}

const require = createRequire(import.meta.url)

function listIcons(): readonly Icon[] {
  const octicons = require('@primer/octicons-react') as Record<string, unknown>

  return Object.keys(octicons)
    .filter((name): name is `${string}Icon` => {
      return name.endsWith('Icon')
    })
    .map(exportName => {
      return {
        name: exportNameToIconName(exportName),
        exportName,
        importPath: '@primer/octicons-react',
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
}

function getIconInfo(name: string): IconInfo | null {
  const normalizedName = normalizeIdentifier(name)
  const icon = listIcons().find(candidate => {
    return (
      normalizeIdentifier(candidate.name) === normalizedName ||
      normalizeIdentifier(candidate.exportName) === normalizedName ||
      normalizeIdentifier(candidate.exportName.replace(/Icon$/, '')) === normalizedName
    )
  })

  if (!icon) {
    return null
  }

  return {
    icon,
    docsUrl: new URL(`/octicons/icon/${icon.name}-16`, 'https://primer.style').toString(),
  }
}

function formatIconList(icons: readonly Icon[]): string {
  return formatTable(icons, [
    {
      header: 'Name',
      getValue: icon => icon.name,
    },
    {
      header: 'Export',
      getValue: icon => icon.exportName,
    },
    {
      header: 'Import path',
      getValue: icon => icon.importPath,
    },
  ])
}

function formatIconInfo(info: IconInfo): string {
  const {icon} = info

  return formatKeyValueTable([
    ['Name', icon.name],
    ['Export', icon.exportName],
    ['Import path', icon.importPath],
    ['Docs', info.docsUrl],
  ])
}

function exportNameToIconName(exportName: string): string {
  const name = exportName.replace(/Icon$/, '')
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function normalizeIdentifier(value: string): string {
  return value
    .toLowerCase()
    .replaceAll(/[\s_-]/g, '')
    .replace(/icon$/, '')
}

export {formatIconInfo, formatIconList, getIconInfo, listIcons}
export type {Icon}
