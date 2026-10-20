import {execFileSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {appendFile, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import glob from 'fast-glob'

const changesetCli = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'))

function formatChangeset(releases, summary) {
  const frontmatter = releases.map(release => {
    return `${JSON.stringify(release.name)}: ${release.type}`
  })
  return `---\n${frontmatter.join('\n')}\n---\n\n${summary}\n`
}

async function workspacePackages(cwd) {
  const {workspaces} = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'))
  const manifests = await glob(
    workspaces.map(workspace => {
      return `${workspace}/package.json`
    }),
    {
      cwd,
      ignore: ['**/node_modules/**'],
    },
  )
  return Promise.all(
    manifests.map(async manifest => {
      const packageJson = JSON.parse(await readFile(path.join(cwd, manifest), 'utf8'))
      return {
        ...packageJson,
        directory: path.dirname(manifest),
      }
    }),
  )
}

export async function prepareRelease(cwd, packageName) {
  if (!packageName) {
    throw new Error('A package name is required.')
  }
  if (existsSync(path.join(cwd, '.changeset/pre.json'))) {
    throw new Error('Package releases are not supported in prerelease mode. Exit prerelease mode first.')
  }
  const packages = await workspacePackages(cwd)
  if (
    !packages.some(pkg => {
      return pkg.name === packageName
    })
  ) {
    throw new Error(`Unknown workspace package: ${packageName}.`)
  }

  const temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'primer-release-package-'))
  const statusPath = path.join(temporaryDirectory, 'status.json')
  const originals = new Map()
  let versioned = false

  function runChangeset(...args) {
    execFileSync(process.execPath, [changesetCli, ...args], {
      cwd,
      stdio: 'inherit',
    })
  }

  try {
    runChangeset('status', '--output', statusPath)
    const {changesets} = JSON.parse(await readFile(statusPath, 'utf8'))
    const selected = changesets.filter(changeset => {
      return changeset.releases.some(release => {
        return release.name === packageName
      })
    })
    if (selected.length === 0) {
      throw new Error(`No pending changesets found for ${packageName}. Use a workspace package name.`)
    }

    for (const changeset of changesets) {
      const filename = path.join(cwd, '.changeset', `${changeset.id}.md`)
      const content = await readFile(filename, 'utf8')
      const releases = changeset.releases.filter(release => {
        return release.name === packageName
      })
      const remaining = changeset.releases.filter(release => {
        return release.name !== packageName
      })
      originals.set(filename, {
        content,
        remaining:
          releases.length === 0 ? content : remaining.length > 0 ? formatChangeset(remaining, changeset.summary) : null,
      })
      if (releases.length > 0) {
        await writeFile(filename, formatChangeset(releases, changeset.summary))
      } else {
        await rm(filename)
      }
    }

    runChangeset('status', '--output', statusPath)
    const plan = JSON.parse(await readFile(statusPath, 'utf8'))
    if (
      !plan.releases.some(release => {
        return release.name === packageName && release.type !== 'none'
      })
    ) {
      throw new Error(`${packageName} is excluded from versioning by the Changesets configuration.`)
    }
    runChangeset('version')
    versioned = true
    return plan
  } finally {
    for (const [filename, original] of originals) {
      const content = versioned ? original.remaining : original.content
      if (content !== null) {
        await writeFile(filename, content)
      }
    }
    await rm(temporaryDirectory, {
      recursive: true,
    })
  }
}

export async function releaseBody(cwd, packageName, plan) {
  const template = await readFile(path.join(cwd, '.github/pull_request_template.md'), 'utf8')
  const packages = await workspacePackages(cwd)
  const releases = []
  for (const release of plan.releases) {
    if (release.type === 'none') {
      continue
    }
    const pkg = packages.find(candidate => {
      return candidate.name === release.name
    })
    if (!pkg) {
      throw new Error(`Cannot find workspace package ${release.name}.`)
    }
    const changelog = await readFile(path.join(cwd, pkg.directory, 'CHANGELOG.md'), 'utf8')
    const lines = changelog.split('\n')
    const start = lines.findIndex(line => {
      return line.trim() === `## ${release.newVersion}`
    })
    if (start === -1) {
      throw new Error(`Cannot find changelog entry for ${release.name}@${release.newVersion}.`)
    }
    const next = lines.findIndex((line, index) => {
      return index > start && line.startsWith('## ')
    })
    releases.push({
      heading: `## ${release.name}@${release.newVersion}`,
      content: lines
        .slice(start + 1, next === -1 ? undefined : next)
        .join('\n')
        .trim(),
    })
  }
  const introduction = `This PR prepares a release for \`${packageName}\` and any required downstream dependency updates. Rerun the Package Release Tracking workflow to refresh this PR from \`main\`.

Publishing is unchanged: merging this PR does not publish immediately while unrelated changesets remain. The existing Release workflow publishes once all pending changesets have been applied.`
  const updatedTemplate = template
    .replace('Closes #', 'Closes')
    .replace(
      '#### Changed\n',
      `#### Changed\n\n- Update versions and changelogs for \`${packageName}\` and required downstream packages.\n`,
    )
    .replace('- [ ] Not sure', '- [x] Not sure')
  const header = `${introduction}\n\n${updatedTemplate.trim()}\n\n# Releases\n\n`
  const body =
    header +
    releases
      .map(release => {
        return `${release.heading}\n\n${release.content}`
      })
      .join('\n\n')
  if (body.length <= 60000) {
    return body
  }
  return `${header}> Changelog details are omitted because they exceed the PR body limit. See the changed CHANGELOG.md files.\n\n${releases
    .map(release => {
      return release.heading
    })
    .join('\n\n')}`
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const cwd = process.cwd()
  const packageName = process.env.RELEASE_PACKAGE
  const plan = await prepareRelease(cwd, packageName)
  const body = await releaseBody(cwd, packageName, plan)
  const bodyPath = path.join(process.env.RUNNER_TEMP, 'release-package-body.md')
  await writeFile(bodyPath, body)
  await appendFile(process.env.GITHUB_OUTPUT, `branch=changeset-release/package/${packageName}\nbody=${bodyPath}\n`)
}
