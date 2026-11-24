import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
import vm from 'node:vm'

const workflow = readFileSync(new URL('../workflows/pr-area-labels.yml', import.meta.url), 'utf8')
const script = workflow.split('          script: |\n')[1]
assert.ok(script, 'The workflow must contain its GitHub API script')

async function run({
  files = [],
  labels = [],
  state = 'open',
  head = 'head',
  currentHead = head,
  changedFiles = files.length,
  knownLabels = [],
  createError,
} = {}) {
  const calls = {added: [], removed: [], created: []}
  let reads = 0
  const github = {
    rest: {
      pulls: {
        get: async () => ({
          data: {
            state,
            head: {sha: reads++ === 0 ? head : currentHead},
            changed_files: changedFiles,
            labels: labels.map(name => ({name})),
          },
        }),
        listFiles: 'files',
      },
      issues: {
        listLabelsForRepo: 'labels',
        createLabel: async ({name}) => {
          if (createError) throw createError
          calls.created.push(name)
        },
        addLabels: async ({labels: additions}) => calls.added.push(...additions),
        removeLabel: async ({name}) => calls.removed.push(name),
      },
    },
    paginate: async method => {
      assert.ok(method === 'files' || method === 'labels')
      return method === 'files' ? files : knownLabels.map(name => ({name}))
    },
  }
  const context = {
    repo: {owner: 'primer', repo: 'react'},
    payload: {pull_request: {number: 1, head: {sha: 'head'}}},
  }
  await vm.runInNewContext(`(async () => {${script}\n})()`, {github, context, core: {info: () => {}}})
  return calls
}

test('labels overlapping areas and creates only missing labels', async () => {
  const calls = await run({
    files: [{filename: 'packages/react/src/Button/Button.stories.tsx'}],
    knownLabels: ['area: react'],
  })
  assert.deepEqual(calls.added, ['area: react', 'area: storybook'])
  assert.deepEqual(calls.created, ['area: storybook'])
})

test('counts both paths of a rename and deleted files', async () => {
  const calls = await run({
    files: [
      {filename: 'packages/mcp/src/example.ts', previous_filename: 'packages/react/src/example.ts', status: 'renamed'},
      {filename: 'contributor-docs/old.md', status: 'removed'},
    ],
  })
  assert.deepEqual(calls.added, ['area: react', 'area: docs', 'area: mcp'])
})

test('removes only stale managed labels and preserves risk and human labels', async () => {
  const calls = await run({
    files: [{filename: 'packages/mcp/src/example.ts'}],
    labels: ['area: react', 'area: mcp', 'area: custom', 'risk: high', 'bug'],
    knownLabels: ['area: mcp'],
  })
  assert.deepEqual(calls, {added: [], removed: ['area: react'], created: []})
})

test('does not re-add or recreate existing labels', async () => {
  const calls = await run({
    files: [{filename: '.github/workflows/ci.yml'}],
    labels: ['area: ci'],
    knownLabels: ['area: ci'],
  })
  assert.deepEqual(calls, {added: [], removed: [], created: []})
})

test('classifies documentation, tooling, tests, examples, packages, and releases', async () => {
  const calls = await run({
    files: [
      'packages/styled-react/README.md',
      'packages/react/src/Box/Box.docs.json',
      'packages/canvas/src/index.ts',
      'packages/rolldown-plugin-import-css/src/index.ts',
      'packages/doc-gen/src/index.ts',
      'package-lock.json',
      'e2e/example.ts',
      'examples/nextjs/page.tsx',
      '.changeset/update.md',
    ].map(filename => ({filename})),
  })
  assert.deepEqual(calls.added, [
    'area: react',
    'area: styled-react',
    'area: docs',
    'area: tooling',
    'area: tests',
    'area: examples',
    'area: canvas',
    'area: release',
  ])
})

test('leaves unmapped files unlabeled and clears stale areas', async () => {
  const calls = await run({files: [{filename: 'LICENSE'}], labels: ['area: react', 'bug']})
  assert.deepEqual(calls, {added: [], removed: ['area: react'], created: []})
})

test('refuses to update labels for closed or stale PRs', async () => {
  for (const options of [{state: 'closed'}, {head: 'old'}, {currentHead: 'new'}]) {
    const calls = await run({
      ...options,
      files: [{filename: 'packages/react/src/index.ts'}],
      knownLabels: ['area: react'],
    })
    assert.deepEqual(calls, {added: [], removed: [], created: []})
  }
})

test('fails explicitly without writes when GitHub returns an incomplete file list', async () => {
  await assert.rejects(
    run({files: [{filename: 'packages/react/src/index.ts'}], changedFiles: 3001}),
    /Incomplete changed-file list/,
  )
})

test('tolerates only an already-created label race and surfaces other API failures', async () => {
  const options = {files: [{filename: '.github/workflows/ci.yml'}]}
  const calls = await run({
    ...options,
    createError: {status: 422, response: {data: {errors: [{code: 'already_exists', resource: 'Label'}]}}},
  })
  assert.deepEqual(calls.added, ['area: ci'])
  for (const createError of [new Error('API unavailable'), {status: 422, response: {data: {errors: []}}}]) {
    await assert.rejects(run({...options, createError}), error => error === createError)
  }
})
