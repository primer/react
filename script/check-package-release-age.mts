import {readFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {setTimeout} from 'node:timers/promises'
import {parseArgs} from 'node:util'

const concurrency = 20
const retries = 3

interface LockfileEntry {
  name?: string
  version?: string
  link?: boolean
}

interface Lockfile {
  packages?: Record<string, LockfileEntry>
}

interface RegistryMetadata {
  versions?: Record<string, unknown>
  time?: Record<string, unknown>
}

async function fetchMetadata(name: string, registryUrl: URL): Promise<RegistryMetadata> {
  for (let attempt = 0; ; attempt++) {
    let response: Response | undefined
    try {
      response = await fetch(new URL(encodeURIComponent(name), registryUrl), {
        signal: AbortSignal.timeout(30_000),
      })
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      if (attempt === retries) {
        throw new Error(`Cannot verify ${name}: ${error instanceof Error ? error.message : String(error)}`, {
          cause: error,
        })
      }
      response = undefined
    }

    if (
      response &&
      (attempt === retries || (response.status < 500 && response.status !== 408 && response.status !== 429))
    ) {
      if (response.status === 404) {
        throw new Error(`Configured registry does not have package ${name}`)
      }
      throw new Error(`Cannot verify ${name}: configured registry returned HTTP ${response.status}`)
    }

    await setTimeout(1000 * 2 ** attempt)
  }
}

function getLockedPackages(lockfiles: Record<string, Lockfile>) {
  const packages = new Map<string, Map<string, Set<string>>>()

  for (const [filename, lockfile] of Object.entries(lockfiles)) {
    if (!lockfile.packages) {
      throw new Error(`${filename} must use lockfileVersion 2 or later to verify package release ages`)
    }

    for (const [path, entry] of Object.entries(lockfile.packages)) {
      if (!path.includes('node_modules/') || entry.link) {
        continue
      }

      const name = entry.name ?? path.slice(path.lastIndexOf('node_modules/') + 'node_modules/'.length)
      if (!entry.version) {
        throw new Error(`Cannot verify package version for ${name} in ${filename}`)
      }
      let versions = packages.get(name)
      if (!versions) {
        versions = new Map()
        packages.set(name, versions)
      }
      let filenames = versions.get(entry.version)
      if (!filenames) {
        filenames = new Set()
        versions.set(entry.version, filenames)
      }
      filenames.add(filename)
    }
  }

  return packages
}

async function checkPackageReleaseAge(
  lockfiles: Record<string, Lockfile>,
  baseLockfiles: Record<string, Lockfile> = {},
  now = Date.now(),
) {
  const packages = getLockedPackages(lockfiles)
  for (const [name, versions] of getLockedPackages(baseLockfiles)) {
    const currentVersions = packages.get(name)
    if (!currentVersions) {
      continue
    }
    for (const version of versions.keys()) {
      currentVersions.delete(version)
    }
    if (currentVersions.size === 0) {
      packages.delete(name)
    }
  }
  if (packages.size === 0) {
    return []
  }

  const cutoff = now - 7 * 24 * 60 * 60 * 1000
  const registry = execFileSync('npm', ['config', 'get', 'registry'], {
    encoding: 'utf8',
  }).trim()
  const registryUrl = new URL(registry.endsWith('/') ? registry : `${registry}/`)
  const errors: Array<string> = []
  const entries = [...packages]
  for (let index = 0; index < entries.length; index += concurrency) {
    await Promise.all(
      entries.slice(index, index + concurrency).map(async ([name, versions]) => {
        const metadata = await fetchMetadata(name, registryUrl)

        for (const [version, filenames] of versions) {
          const label = `${name}@${version} (${[...filenames].join(', ')})`
          if (!metadata.versions || !Object.hasOwn(metadata.versions, version)) {
            errors.push(`Configured registry does not have package version ${label}`)
            continue
          }
          const timestamp = metadata.time?.[version]
          const published = typeof timestamp === 'string' ? Date.parse(timestamp) : NaN
          if (!Number.isFinite(published)) {
            errors.push(`Cannot verify publish time for ${label}`)
          } else if (published > cutoff) {
            errors.push(`${label} is younger than 7 days (published ${timestamp})`)
          }
        }
      }),
    )
  }

  return errors
}

if (import.meta.main) {
  try {
    const {values, positionals} = parseArgs({
      options: {
        diff: {
          type: 'boolean',
        },
      },
      allowPositionals: true,
    })
    if (positionals.length > 1 || (!values.diff && positionals.length > 0)) {
      throw new Error('Usage: node script/check-package-release-age.ts [--diff [base-ref]]')
    }

    const filenames = execFileSync('git', ['ls-files', '-z', '*package-lock.json', '*npm-shrinkwrap.json'], {
      encoding: 'utf8',
    })
      .split('\0')
      .filter(Boolean)
    if (filenames.length === 0) {
      throw new Error('No tracked npm lockfiles found')
    }

    const lockfiles: Record<string, Lockfile> = Object.fromEntries(
      filenames.map(filename => {
        return [filename, JSON.parse(readFileSync(filename, 'utf8'))]
      }),
    )
    let baseLockfiles: Record<string, Lockfile> = {}
    if (values.diff) {
      const base = execFileSync('git', ['merge-base', 'HEAD', positionals[0] ?? 'origin/main'], {
        encoding: 'utf8',
      }).trim()
      const baseFilenames = execFileSync('git', ['ls-tree', '-r', '--name-only', '-z', base], {
        encoding: 'utf8',
      })
        .split('\0')
        .filter(filename => {
          return filename.endsWith('package-lock.json') || filename.endsWith('npm-shrinkwrap.json')
        })
      baseLockfiles = Object.fromEntries(
        baseFilenames.map(filename => {
          return [
            filename,
            JSON.parse(
              execFileSync('git', ['show', `${base}:${filename}`], {
                encoding: 'utf8',
                maxBuffer: 50 * 1024 * 1024,
              }),
            ),
          ]
        }),
      )
    }

    const errors = await checkPackageReleaseAge(lockfiles, baseLockfiles)
    for (const error of errors) {
      process.stderr.write(`::error::${error}\n`)
    }
    if (errors.length > 0) {
      process.exitCode = 1
    } else {
      process.stdout.write('All checked registry package versions are at least 7 days old.\n')
    }
  } catch (error) {
    process.stderr.write(`::error::${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
  }
}
