/* eslint camelcase: ["error", {allow: ["pull_request", "html_url", "issue_number", "aw_review"]}] */
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
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
        {issue_number: '8384', component: 'Button', body: commentBody, ...item},
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
  for (const item of [{issue_number: '-1'}, {component: '../Button'}, {component: undefined}, {body: ''}]) {
    const fixture = setup()
    await assert.rejects(fixture.run(item), /Invalid component review payload/)
    assert.equal(fixture.calls.length, 0)
  }
  const fixture = setup()
  await assert.rejects(
    fixture.run({issue_number: 'aw_review'}, {aw_review: {repo: 'primer/other', number: 8384}}),
    /Cross-repository/,
  )
  assert.equal(fixture.calls.length, 0)
})

test('respects staged mode and the per-run publication cap', async () => {
  const fixture = setup({staged: true})
  await fixture.run()
  assert.equal(fixture.calls.length, 0)
  fixture.config.publishCount = 100
  await assert.rejects(fixture.run(), /At most 100/)
  assert.equal(fixture.calls.length, 0)
})

test('successive component publications preserve other checklist links', async () => {
  const fixture = setup()
  fixture.issue.body += '\n- [ ] [Dialog change](#api-review-comment-Dialog)'
  await fixture.run()
  await fixture.run({component: 'Dialog'})
  assert.equal(fixture.issue.body.includes('#api-review-comment-'), false)
  assert.equal(
    fixture.issue.body,
    `- [ ] [Button API change](${commentUrl})\n- [ ] [Dialog change](${commentUrl.replace('123', '124')})`,
  )
  assert.equal(fixture.calls.filter(([name]) => name === 'createComment').length, 2)
})

test('overview instructions replace instead of append and precede comment publication', () => {
  assert.match(workflow, /`update_issue`\n\s+and `operation: replace`/)
  assert.match(workflow, /Queue the overview before the\ncomponent publishers/)
  assert.match(workflow, /at most two sentences/)
})
