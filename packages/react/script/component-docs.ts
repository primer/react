import {globSync, lstatSync, realpathSync, rmSync} from 'node:fs'
import path from 'node:path'
import {pathToFileURL} from 'node:url'
import type {Plugin} from 'rolldown'
import {register} from 'tsx/esm/api'
import {serializeComponentDocs, type ComponentDocs} from '../src/docs/components'

const directoryByStatus = new Map([
  ['stable', ''],
  ['experimental', 'experimental/'],
  ['deprecated', 'deprecated/'],
])

export function getComponentDocAssets(directory: string, component: ComponentDocs) {
  return Object.entries(serializeComponentDocs(component)).map(([section, content]) => {
    return {
      fileName: `${directory}/${section}.md`,
      source: content.trim() ? `# ${component.displayName}\n\n${content}\n` : undefined,
    }
  })
}

export function componentDocs(): Plugin {
  let generation = 0
  const ownedFileNames = new Set<string>()

  return {
    name: 'primer-component-docs',
    async buildStart() {
      const sourceDir = path.resolve('src')
      const files = globSync('**/*.docs.ts', {cwd: sourceDir}).sort()
      // Use a fresh loader namespace on rebuilds so imports reflect the latest source.
      const loader = register({namespace: `primer-component-docs-${++generation}`, tsconfig: false})
      const parentURL = pathToFileURL(path.resolve('rolldown.config.ts')).href
      const load = (file: string): Promise<Record<string, unknown>> => {
        return loader.import(pathToFileURL(path.join(sourceDir, file)).href, parentURL)
      }

      try {
        const assets = new Map<string, {file: string; directory: string; component: ComponentDocs}>()
        const registerDirectory = (file: string, directory: string, component: ComponentDocs) => {
          const key = directory.toLowerCase()
          const previous = assets.get(key)
          if (previous) {
            throw new Error(`Component docs path collision at ${directory}: ${previous.file} and ${file}`)
          }
          assets.set(key, {file, directory, component})
        }
        for (const file of files) {
          this.addWatchFile(path.join(sourceDir, file))
          const {default: component} = (await load(file)) as {default: ComponentDocs}
          if (!/^[A-Za-z][A-Za-z0-9]*$/.test(component.name)) {
            throw new Error(`Invalid component docs name in ${file}: ${component.name}`)
          }
          const group = directoryByStatus.get(component.status)
          if (group === undefined) {
            throw new Error(`Invalid component docs status in ${file}: ${component.status}`)
          }
          registerDirectory(file, `docs/components/${group}${component.name}`, component)
        }

        const entries = [...assets.values()]
        const nextEntries = entries.filter(({component}) => component.importPath === '@primer/react/next')
        const groups = [
          ['docs/index.ts', entries],
          ['docs/experimental.ts', entries.filter(({component}) => component.status === 'experimental')],
          ['docs/deprecated.ts', entries.filter(({component}) => component.status === 'deprecated')],
          ['docs/next.ts', nextEntries],
        ] as const
        for (const [entry, expected] of groups) {
          const exports = Object.values(await load(entry)).filter(value => typeof value !== 'function')
          const missing = expected.filter(({component}) => !exports.includes(component))
          if (missing.length > 0 || exports.length !== expected.length) {
            throw new Error(`Component docs exports do not match ${entry}: ${missing.map(({file}) => file).join(', ')}`)
          }
        }

        for (const {component} of entries) {
          // A component may no longer be on Next after a scoped rebuild.
          ownedFileNames.add(`docs/components/next/${component.name}/props.md`)
          ownedFileNames.add(`docs/components/next/${component.name}/usage.md`)
        }
        for (const {file, component} of nextEntries) {
          registerDirectory(file, `docs/components/next/${component.name}`, component)
        }
        for (const {directory, component} of assets.values()) {
          ownedFileNames.add(`${directory}.md`)
          for (const {fileName, source} of getComponentDocAssets(directory, component)) {
            ownedFileNames.add(fileName)
            if (source !== undefined) {
              this.emitFile({type: 'asset', fileName, source})
            }
          }
        }
      } finally {
        await loader.unregister()
      }
    },
    writeBundle({dir}, bundle) {
      if (!dir) {
        return
      }

      // Scoped rebuilds do not clean dist. Remove only exact names this plugin owns.
      const emittedFileNames = new Set(Object.keys(bundle).map(fileName => fileName.toLowerCase()))
      for (const fileName of ownedFileNames) {
        if (emittedFileNames.has(fileName.toLowerCase())) {
          continue
        }
        const target = path.resolve(dir, fileName)
        const parent = path.dirname(target)
        if (lstatSync(target, {throwIfNoEntry: false})?.isFile() && realpathSync(parent) === parent) {
          rmSync(target, {force: true})
        }
      }
    },
  }
}
