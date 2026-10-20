import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {existsSync} from 'node:fs'
import {mkdir, mkdtemp, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {test} from 'node:test'
import {fileURLToPath} from 'node:url'
import {prepareRelease, releaseBody} from './release-package.mjs'

async function fixture(t, changesets) {
  const cwd = await mkdtemp(path.join(tmpdir(), 'primer-release-package-test-'))
  t.after(async () => {
    await rm(cwd, {
      recursive: true,
    })
  })
  async function write(filename, content) {
    await mkdir(path.dirname(path.join(cwd, filename)), {
      recursive: true,
    })
    await writeFile(path.join(cwd, filename), content)
  }
  await write(
    'package.json',
    JSON.stringify({
      name: 'release-test',
      private: true,
      workspaces: ['packages/*'],
    }),
  )
  await write('package-lock.json', '{"lockfileVersion":3}')
  await write(
    '.changeset/config.json',
    JSON.stringify({
      changelog: ['./changelog.cjs', null],
      baseBranch: 'main',
      access: 'public',
      updateInternalDependencies: 'patch',
    }),
  )
  await write(
    '.changeset/changelog.cjs',
    `module.exports = {
      getReleaseLine: async (changeset) => {
        return '- ' + changeset.summary
      },
      getDependencyReleaseLine: async () => {
        return '- Update dependencies'
      },
    }`,
  )
  await write(
    '.github/pull_request_template.md',
    'Closes #\n\n<!-- Keep this comment -->\n\n### Changelog\n\n#### New\n\n#### Changed\n\n#### Removed\n\n### Rollout strategy\n\n- [ ] Not sure\n\n### Testing & Reviewing\n',
  )
  for (const name of ['alpha', 'bravo', 'consumer']) {
    await write(
      `packages/${name}/package.json`,
      JSON.stringify({
        name: `@test/${name}`,
        version: '1.0.0',
        ...(name === 'consumer'
          ? {
              dependencies: {
                '@test/alpha': '^1.0.0',
              },
            }
          : {}),
      }),
    )
  }
  for (const [name, content] of Object.entries(changesets)) {
    await write(`.changeset/${name}.md`, content)
  }
  const gitOptions = {
    cwd,
    stdio: 'pipe',
  }
  execFileSync('git', ['init', '-b', 'main'], gitOptions)
  execFileSync('git', ['add', '.'], gitOptions)
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', 'commit', '-m', 'test: initialize release fixture'],
    gitOptions,
  )
  return {
    cwd,
    write,
    read: async filename => {
      return readFile(path.join(cwd, filename), 'utf8')
    },
    manifest: async name => {
      return JSON.parse(await readFile(path.join(cwd, `packages/${name}/package.json`), 'utf8'))
    },
  }
}

test('versions only the selected package and preserves unrelated and shared changesets', async t => {
  const unrelated = '---\n"@test/bravo": major\n---\n\nUnrelated release.\n'
  const project = await fixture(t, {
    alpha: '---\n"@test/alpha": minor\n---\n\nAdd alpha feature.\n',
    shared: '---\n"@test/alpha": patch\n"@test/bravo": minor\n---\n\nShared fix.\n',
    unrelated,
  })
  const plan = await prepareRelease(project.cwd, '@test/alpha')
  assert.equal((await project.manifest('alpha')).version, '1.1.0')
  assert.equal((await project.manifest('bravo')).version, '1.0.0')
  assert.equal((await project.manifest('consumer')).version, '1.0.0')
  assert.equal(await project.read('.changeset/unrelated.md'), unrelated)
  assert.equal(await project.read('.changeset/shared.md'), '---\n"@test/bravo": minor\n---\n\nShared fix.\n')
  assert.equal(existsSync(path.join(project.cwd, '.changeset/alpha.md')), false)
  const body = await releaseBody(project.cwd, '@test/alpha', plan)
  assert.match(body, /## @test\/alpha@1\.1\.0/)
  assert.match(body, /Add alpha feature\./)
  assert.match(body, /Shared fix\./)
  assert.doesNotMatch(body, /Unrelated release|## @test\/bravo/)
  assert.match(body, /Publishing is unchanged/)
  assert.match(body, /<!-- Keep this comment -->/)
  assert.match(body, /### Testing & Reviewing/)

  await project.write('packages/alpha/CHANGELOG.md', `## 1.1.0\n\n${'Long release notes.\n'.repeat(4000)}`)
  const abbreviatedBody = await releaseBody(project.cwd, '@test/alpha', plan)
  assert.ok(abbreviatedBody.length < 60000)
  assert.match(abbreviatedBody, /Changelog details are omitted/)
  assert.match(abbreviatedBody, /## @test\/alpha@1\.1\.0/)
})

test('includes required dependent bumps without consuming their pending changesets', async t => {
  const pending = '---\n"@test/consumer": minor\n---\n\nUnreleased consumer feature.\n'
  const project = await fixture(t, {
    alpha: '---\n"@test/alpha": major\n---\n\nBreaking alpha change.\n',
    consumer: pending,
  })
  const plan = await prepareRelease(project.cwd, '@test/alpha')
  assert.equal((await project.manifest('alpha')).version, '2.0.0')
  const consumer = await project.manifest('consumer')
  assert.equal(consumer.version, '1.0.1')
  assert.equal(consumer.dependencies['@test/alpha'], '^2.0.0')
  assert.equal(await project.read('.changeset/consumer.md'), pending)
  const body = await releaseBody(project.cwd, '@test/alpha', plan)
  assert.match(body, /## @test\/consumer@1\.0\.1/)
  assert.doesNotMatch(body, /Unreleased consumer feature/)
})

test('rejects unknown packages and packages without changesets without changing files', async t => {
  const content = '---\n"@test/bravo": patch\n---\n\nBravo fix.\n'
  const project = await fixture(t, {
    bravo: content,
  })
  await assert.rejects(prepareRelease(project.cwd, '@test/missing'), /Unknown workspace package/)
  await assert.rejects(prepareRelease(project.cwd, '@test/alpha'), /No pending changesets/)
  assert.equal(await project.read('.changeset/bravo.md'), content)
  assert.equal((await project.manifest('bravo')).version, '1.0.0')
})

test('rejects prerelease mode before modifying changesets', async t => {
  const content = '---\n"@test/alpha": patch\n---\n\nAlpha fix.\n'
  const project = await fixture(t, {
    alpha: content,
  })
  await project.write('.changeset/pre.json', '{}')
  await assert.rejects(prepareRelease(project.cwd, '@test/alpha'), /prerelease mode/)
  assert.equal(await project.read('.changeset/alpha.md'), content)
})

test('rejects excluded packages and restores their changesets', async t => {
  const content = '---\n"@test/bravo": patch\n---\n\nBravo fix.\n'
  const project = await fixture(t, {
    bravo: content,
  })
  const config = JSON.parse(await project.read('.changeset/config.json'))
  await project.write(
    '.changeset/config.json',
    JSON.stringify({
      ...config,
      ignore: ['@test/bravo'],
    }),
  )
  await assert.rejects(prepareRelease(project.cwd, '@test/bravo'), /excluded from versioning/)
  assert.equal(await project.read('.changeset/bravo.md'), content)
  assert.equal((await project.manifest('bravo')).version, '1.0.0')
})

test('restores original changesets when versioning fails', async t => {
  const shared = '---\n"@test/alpha": patch\n"@test/bravo": minor\n---\n\nShared fix.\n'
  const unrelated = '---\n"@test/bravo": major\n---\n\nBravo feature.\n'
  const project = await fixture(t, {
    shared,
    unrelated,
  })
  await project.write('.changeset/changelog.cjs', 'throw new Error("Changelog failure")')
  await assert.rejects(prepareRelease(project.cwd, '@test/alpha'), /Command failed/)
  assert.equal(await project.read('.changeset/shared.md'), shared)
  assert.equal(await project.read('.changeset/unrelated.md'), unrelated)
})

test('writes the package branch and release body for the workflow', async t => {
  const project = await fixture(t, {
    alpha: '---\n"@test/alpha": patch\n---\n\nAlpha fix.\n',
  })
  const outputPath = path.join(project.cwd, 'github-output')
  execFileSync(process.execPath, [fileURLToPath(new URL('./release-package.mjs', import.meta.url))], {
    cwd: project.cwd,
    env: {
      ...process.env,
      RELEASE_PACKAGE: '@test/alpha',
      RUNNER_TEMP: project.cwd,
      GITHUB_OUTPUT: outputPath,
    },
    stdio: 'pipe',
  })
  const output = await readFile(outputPath, 'utf8')
  assert.equal(
    output,
    `branch=changeset-release/package/@test/alpha\nbody=${path.join(project.cwd, 'release-package-body.md')}\n`,
  )
  assert.match(await project.read('release-package-body.md'), /## @test\/alpha@1\.0\.1/)
  assert.equal((await project.manifest('alpha')).version, '1.0.1')
})
