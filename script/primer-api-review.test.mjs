/* eslint camelcase: ["error", {allow: ["pull_request", "html_url", "issue_number", "aw_review"]}] */
import assert from 'node:assert/strict'
import {mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs'
import {execFileSync} from 'node:child_process'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {test} from 'node:test'

const workflow = readFileSync(new URL('../.github/workflows/primer-api-review.md', import.meta.url), 'utf8')
const script = workflow
  .match(/ {6}script: \|\n([\s\S]*?)\n---/)[1]
  .split('\n')
  .map(line => line.slice(8))
  .join('\n')
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
const publish = new AsyncFunction(
  'item',
  'resolvedTemporaryIds',
  'config',
  'context',
  'github',
  'core',
  'process',
  'require',
  'sanitizeContent',
  script,
)
const workflowMarker = '<!-- gh-aw-workflow-id: primer-api-review -->'
const componentMarker = '<!-- primer-api-review-component: Button -->'
const commentUrl = 'https://github.com/primer/react/issues/8384#issuecomment-123'
const commentBody = '### Button\n\nEvidence-backed API findings'
const encodeComments = entries => Buffer.from(JSON.stringify(entries), 'utf8').toString('base64')

function setup({comments = [], title = 'Primer API Review', pullRequest, staged = false} = {}) {
  const calls = []
  const issue = {
    title,
    pull_request: pullRequest,
    body: '- [ ] [Button API change](#api-review-comment-Button)',
  }
  const config = {}
  const issues = {
    get: async () => ({data: issue}),
    listComments: () => {},
    createComment: async args => {
      calls.push(['createComment', args])
      const comment = {
        id: 123 + comments.length,
        html_url: commentUrl.replace('123', String(123 + comments.length)),
        user: {login: 'github-actions[bot]'},
        body: args.body,
      }
      comments.push(comment)
      return {data: comment}
    },
    updateComment: async args => {
      calls.push(['updateComment', args])
      const comment = comments.find(value => value.id === args.comment_id)
      comment.body = args.body
      return {data: comment}
    },
    update: async args => {
      calls.push(['update', args])
      issue.body = args.body
    },
  }
  return {
    calls,
    issue,
    config,
    run: (item = {}, resolved = {}) =>
      publish(
        {issue_number: '8384', comments: encodeComments([{component: 'Button', body: commentBody}]), ...item},
        resolved,
        config,
        {repo: {owner: 'primer', repo: 'react'}},
        {rest: {issues}, paginate: async () => comments},
        {info: () => {}},
        {env: {GH_AW_SAFE_OUTPUTS_STAGED: String(staged)}},
        () => ({
          matchesWorkflowId: body => body.includes(workflowMarker),
          generateWorkflowIdMarker: () => workflowMarker,
        }),
        body => `sanitized:${body}`,
      ),
  }
}

test('creates a sanitized component comment and replaces every matching checklist link', async () => {
  const fixture = setup()
  fixture.issue.body += '\n- [ ] [Another finding](#api-review-comment-Button)'
  await fixture.run()
  assert.deepEqual(
    fixture.calls.map(([name]) => name),
    ['createComment', 'update'],
  )
  assert.equal(fixture.calls[0][1].body, `sanitized:${commentBody}\n\n${componentMarker}\n${workflowMarker}`)
  assert.equal(fixture.issue.body.split(commentUrl).length - 1, 2)
  await fixture.run()
  assert.equal(fixture.calls.length, 2, 'unchanged reruns must not create comments or rewrite the issue')
})

test('updates only its own managed component comment', async () => {
  const comments = [
    {id: 1, user: {login: 'maintainer'}, body: `${componentMarker}\n${workflowMarker}`},
    {id: 2, user: {login: 'github-actions[bot]'}, body: componentMarker},
    {id: 3, user: {login: 'github-actions[bot]'}, body: `${componentMarker}\n${workflowMarker}`, html_url: commentUrl},
  ]
  const fixture = setup({comments})
  await fixture.run()
  assert.equal(fixture.calls[0][0], 'updateComment')
  assert.equal(fixture.calls[0][1].comment_id, 3)
  assert.equal(comments[0].body, `${componentMarker}\n${workflowMarker}`)
  assert.equal(comments[1].body, componentMarker)
})

test('resolves a newly created issue temporary ID in this repository', async () => {
  const fixture = setup()
  await fixture.run({issue_number: 'aw_review'}, {aw_review: {repo: 'primer/react', number: 8384}})
  assert.equal(fixture.calls[0][1].issue_number, 8384)
})

test('rejects invalid targets and payloads without writing', async () => {
  for (const options of [{title: 'Another issue'}, {pullRequest: {url: 'pr'}}]) {
    const fixture = setup(options)
    await assert.rejects(fixture.run(), /Target must be/)
    assert.equal(fixture.calls.length, 0)
  }
  for (const item of [
    {issue_number: '-1'},
    {comments: undefined},
    {comments: 'x'.repeat(500001)},
    ...[{component: '../Button'}, {component: undefined}, {body: ''}, null].map(entry => ({
      comments: encodeComments([entry]),
    })),
  ]) {
    const fixture = setup()
    await assert.rejects(fixture.run(item), /Invalid.*component review/)
    assert.equal(fixture.calls.length, 0)
  }
  const fixture = setup()
  await assert.rejects(
    fixture.run({issue_number: 'aw_review'}, {aw_review: {repo: 'primer/other', number: 8384}}),
    /Cross-repository/,
  )
  assert.equal(fixture.calls.length, 0)
})

test('respects staged mode and validates the whole bounded batch before writing', async () => {
  const fixture = setup({staged: true})
  await fixture.run()
  await fixture.run({issue_number: 'aw_review'})
  assert.equal(fixture.calls.length, 0)
  assert.equal(fixture.calls.length, 0)
  for (const entries of [
    [],
    {},
    Array.from({length: 101}, (_, index) => ({component: `Component${index}`, body: commentBody})),
    [
      {component: 'Button', body: commentBody},
      {component: 'Button', body: commentBody},
    ],
    [
      {component: 'Button', body: commentBody},
      {component: 'Dialog', body: ''},
    ],
  ]) {
    const invalid = setup()
    await assert.rejects(invalid.run({comments: encodeComments(entries)}))
    assert.equal(invalid.calls.length, 0)
  }
  await assert.rejects(fixture.run({comments: '[invalid base64'}), /Invalid base64/)
  await assert.rejects(fixture.run({comments: Buffer.from('[invalid JSON').toString('base64')}), SyntaxError)
})

test('one batch publishes all component comments and preserves their checklist links', async () => {
  const fixture = setup()
  fixture.issue.body += '\n- [ ] [Dialog change](#api-review-comment-Dialog)'
  const item = {
    comments: encodeComments([
      {component: 'Button', body: commentBody},
      {component: 'Dialog', body: '### Dialog\n\nEvidence-backed API findings'},
    ]),
  }
  await fixture.run(item)
  assert.equal(fixture.issue.body.includes('#api-review-comment-'), false)
  assert.equal(
    fixture.issue.body,
    `- [ ] [Button API change](${commentUrl})\n- [ ] [Dialog change](${commentUrl.replace('123', '124')})`,
  )
  assert.equal(fixture.calls.filter(([name]) => name === 'createComment').length, 2)
  assert.equal(fixture.calls.filter(([name]) => name === 'update').length, 1)
  await fixture.run(item)
  assert.equal(fixture.calls.length, 3, 'reruns reuse every comment in the batch')
})

test('overview instructions replace instead of append and precede comment publication', () => {
  assert.match(workflow, /`update_issue`\n\s+and `operation: replace`/)
  assert.match(workflow, /Queue the overview before the batch publisher/)
  assert.match(workflow, /exactly one `publish_component_findings` call/)
  assert.match(workflow, /at most two sentences/)
})

// Set GH_AW_ACTIONS_DIR to actions/setup/js from the lock file's pinned gh-aw release.
test(
  'pinned gh-aw ingestion accepts all 19 comments in one output, not 19 outputs',
  {
    skip: !process.env.GH_AW_ACTIONS_DIR,
  },
  async () => {
    const directory = mkdtempSync(join(tmpdir(), 'api-review-ingestion-'))
    try {
      const lock = readFileSync(new URL('../.github/workflows/primer-api-review.lock.yml', import.meta.url), 'utf8')
      const config = JSON.parse(JSON.parse(lock.match(/GH_AW_SAFE_OUTPUTS_CONFIG: (.+)/)[1]))
      writeFileSync(join(directory, 'config.json'), JSON.stringify(config))
      const entries = Array.from({length: 19}, (_, index) => ({
        component: `Component${index}`,
        body: `### Component${index}\n\n| Evidence | Impact | Recommendation |\n| --- | --- | --- |\n| [Source](https://github.com/primer/react/blob/main/file.ts#L1) | "quoted" and ＂fullwidth＂ text | Use \`size\` |\n\n<details><summary>Past findings</summary>\n\nSee https://example.com/documentation for more context. No past findings.\n\n</details>`,
      }))
      const message = {type: 'publish_component_findings', issue_number: '8384', comments: encodeComments(entries)}
      const ingest = messages => {
        writeFileSync(join(directory, 'outputs.jsonl'), messages.map(value => JSON.stringify(value)).join('\n'))
        return JSON.parse(
          execFileSync(
            process.execPath,
            [
              '-e',
              `
        const path = require('node:path');
        const runtime = process.env.GH_AW_ACTIONS_DIR;
        require(path.join(runtime, 'constants.cjs')).TMP_GH_AW_PATH = process.env.TEST_DIRECTORY;
        global.core = {
          info() {}, warning() {}, error() {}, debug() {}, exportVariable() {},
          setFailed(message) { throw new Error(message); },
          setOutput(name, value) { if (name === 'output') process.stdout.write(value); },
        };
        global.context = {repo: {owner: 'primer', repo: 'react'}, payload: {}};
        global.github = {};
        require(path.join(runtime, 'collect_ndjson_output.cjs')).main().catch(error => {
          console.error(error);
          process.exitCode = 1;
        });
      `,
            ],
            {
              encoding: 'utf8',
              env: {
                ...process.env,
                TEST_DIRECTORY: directory,
                RUNNER_TEMP: directory,
                GH_AW_SAFE_OUTPUTS: join(directory, 'outputs.jsonl'),
                GH_AW_SAFE_OUTPUTS_CONFIG_PATH: join(directory, 'config.json'),
                GH_AW_VALIDATION_CONFIG_PATH: join(directory, 'missing-validation.json'),
                GH_AW_VALIDATION_CONFIG: '',
              },
            },
          ),
        )
      }
      const rejected = ingest(entries.map(entry => ({...message, comments: encodeComments([entry])})))
      assert.equal(rejected.items.length, 1)
      assert.equal(rejected.errors.length, 18)
      assert.match(rejected.errors[0], /Maximum allowed: 1/)
      const accepted = ingest([message])
      assert.deepEqual(accepted.errors, [])
      assert.equal(accepted.items.length, 1)
      assert.deepEqual(JSON.parse(Buffer.from(accepted.items[0].comments, 'base64').toString('utf8')), entries)
      const fixture = setup()
      fixture.issue.body = entries.map(entry => `- [ ] [Finding](#api-review-comment-${entry.component})`).join('\n')
      await fixture.run(accepted.items[0])
      assert.equal(fixture.calls.filter(([name]) => name === 'createComment').length, 19)
      assert.equal(fixture.issue.body.includes('#api-review-comment-'), false)
    } finally {
      rmSync(directory, {recursive: true, force: true})
    }
  },
)
