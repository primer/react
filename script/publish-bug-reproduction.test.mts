import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {test} from 'node:test'
import {reproductionFiles} from './create-stackblitz-reproduction.ts'
import {publishBugReproduction} from './publish-bug-reproduction.ts'
import type {ReproductionPublisher} from './publish-bug-reproduction.ts'

async function fixture() {
  const files = Object.fromEntries(
    await Promise.all(
      reproductionFiles.map(async file => [file, await readFile(`examples/stackblitz/${file}`, 'utf8')]),
    ),
  )
  const calls: string[] = []
  let posted = ''
  let hasImage = false
  const publisher: ReproductionPublisher = {
    async getIssue() {
      return {state: 'open', body: 'Bug description', labels: ['bug']}
    },
    async getComments() {
      return []
    },
    async createTree(_files, screenshot) {
      calls.push('tree')
      hasImage = screenshot !== undefined
      return 'tree-sha'
    },
    async getBranch() {
      return undefined
    },
    async createCommit() {
      calls.push('commit')
      return 'commit-sha'
    },
    async createBranch(branch) {
      calls.push(branch)
    },
    async createComment(body) {
      calls.push('comment')
      posted = body
    },
  }
  const options = {
    bundle: {files, screenshot: 'iVBORw0KGgo='},
    body: 'Confirmed symptom and one-variable control in Chromium.',
    repository: 'primer/react',
    issueNumber: 123,
    runId: '456',
    staged: false,
    publisher,
  }
  return {options, calls, posted: () => posted, hasImage: () => hasImage}
}

test('persists exactly the verified files before posting an immutable StackBlitz link', async () => {
  const {options, calls, posted, hasImage} = await fixture()
  await publishBugReproduction(options)
  assert.deepEqual(calls, ['tree', 'commit', 'reproductions/bug-123-456', 'comment'])
  assert.match(posted(), /stackblitz.com\/github\/primer\/react\/tree\/commit-sha/)
  assert.match(posted(), /primer-bug-reproduction/)
  assert.match(posted(), /actions\/runs\/456/)
  assert.equal(hasImage(), true)
})

test('skips closed, unlabelled, and previously handled issues and respects staged mode', async () => {
  for (const reason of ['closed', 'unlabelled', 'duplicate', 'staged']) {
    const {options, calls} = await fixture()
    options.publisher.getIssue = async () => ({
      state: reason === 'closed' ? 'closed' : 'open',
      body: null,
      labels: reason === 'unlabelled' ? [] : ['bug'],
    })
    options.publisher.getComments = async () => [
      {body: reason === 'duplicate' ? '<!-- primer-bug-reproduction -->' : ''},
    ]
    options.staged = reason === 'staged'
    await publishBugReproduction(options)
    assert.deepEqual(calls, [])
  }
})

test('does not add another screenshot when a human has already supplied media', async () => {
  const {options, posted, hasImage} = await fixture()
  options.publisher.getComments = async () => [{body: '![Recording](https://example.com/bug.gif)'}]
  await publishBugReproduction(options)
  assert.equal(hasImage(), false)
  assert.ok(!posted().includes('![Reproduced issue]'))
})

test('rejects extra files, unpinned dependencies, invalid images and conflicting replay branches', async () => {
  for (const invalid of ['path', 'version', 'script', 'image', 'branch']) {
    const {options, calls} = await fixture()
    if (invalid === 'path') options.bundle.files['../secret'] = 'secret'
    if (invalid === 'version') {
      const manifest = JSON.parse(options.bundle.files['package.json'])
      manifest.dependencies.react = 'latest'
      options.bundle.files['package.json'] = JSON.stringify(manifest)
    }
    if (invalid === 'script') {
      const manifest = JSON.parse(options.bundle.files['package.json'])
      manifest.scripts.postinstall = 'unexpected-command'
      options.bundle.files['package.json'] = JSON.stringify(manifest)
    }
    if (invalid === 'image') options.bundle.screenshot = 'bm90IGEgcG5n'
    if (invalid === 'branch') options.publisher.getBranch = async () => ({sha: 'other', tree: 'other-tree'})
    await assert.rejects(publishBugReproduction(options))
    assert.ok(!calls.includes('comment'))
  }
})

test('enforces the source limit and accepts PNGs only up to the two-megabyte limit', async () => {
  const oversizedSource = await fixture()
  oversizedSource.options.bundle.files['src/App.tsx'] = 'x'.repeat(128 * 1024)
  await assert.rejects(publishBugReproduction(oversizedSource.options), /exceeds 128 KB/)
  assert.deepEqual(oversizedSource.calls, [])

  for (const size of [2 * 1024 * 1024, 2 * 1024 * 1024 + 1]) {
    const {options, calls} = await fixture()
    const image = Buffer.alloc(size)
    Buffer.from('89504e470d0a1a0a', 'hex').copy(image)
    options.bundle.screenshot = image.toString('base64')
    if (size === 2 * 1024 * 1024) {
      await publishBugReproduction(options)
      assert.ok(calls.includes('comment'))
    } else {
      await assert.rejects(publishBugReproduction(options), /at most 2 MB/)
      assert.deepEqual(calls, [])
    }
  }
})
