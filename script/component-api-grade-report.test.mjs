import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateAudit,
  candidateChecks,
  checks,
} from '../.agents/skills/component-api-design/references/scorecard-calculator.mjs'
import {
  componentSlug,
  createGitHubApi,
  createIssueSyncPlan,
  syncGradeIssues,
  validateReportInput,
} from './component-api-grade-report.mjs'

const sourceSha = '2128032dca65a1bd565fe382c2e91c638c6473a4'
const testSlug = componentSlug('TestComponent')
const findingMarker = checkId => `<!-- component-api-grade:finding:${testSlug}:${checkId} -->`

function createFinding({id, checkId, section, classification = 'ADR GAP', severity = 'FIX'}) {
  return {
    id,
    classification,
    severity,
    checkId,
    section,
    status: 'OPEN',
    title: `Finding ${id}`,
    reachableUseCase: 'A documented consumer renders the component',
    observedGap: 'The component misses a verified API requirement',
    additiveFix: 'Add the requirement while preserving existing props',
    citations: [{path: 'packages/react/src/TestComponent.tsx', line: '1', sha: sourceSha}],
  }
}

function createAudit() {
  return {
    component: 'TestComponent',
    sourceSha,
    pendingHuman: false,
    checks: Object.entries(checks).map(([id]) => ({
      id,
      verdict: 'PASS',
      evidenceClass: ['TYPE-01', 'TEST-01', 'INTERACTION-01'].includes(id) ? 'EXECUTION VERIFIED' : 'SOURCE VERIFIED',
      evidence: `Verified ${id}`,
    })),
    findings: [],
    candidateChecks: Object.entries(candidateChecks).map(([id]) => ({
      id,
      verdict: 'PASS',
      evidenceClass: 'SOURCE VERIFIED',
      evidence: `Verified ${id}`,
    })),
    candidateFindings: [],
    contractFindings: [],
  }
}

function createScorecard(audit) {
  const grade = calculateAudit(audit)
  const score =
    grade.scoreRange === null
      ? 'UNKNOWN'
      : `${grade.scoreRange.min.toFixed(2)}${
          grade.scoreRange.min === grade.scoreRange.max ? '' : `-${grade.scoreRange.max.toFixed(2)}`
        } / 100`
  const letterGrade = grade.grade ?? (grade.gradeRange ? `${grade.gradeRange.min}-${grade.gradeRange.max}` : 'UNKNOWN')
  return `# ${audit.component} component API scorecard\n\n**Component:** ${audit.component} · **Active grade:** ${score} · ${letterGrade} · **Status:** ${grade.status}\n\n${audit.sourceSha}`
}

function createIssue({number, id = number, marker, state = 'open'}) {
  return {
    id,
    number,
    state,
    title: `Issue ${number}`,
    body: marker,
    html_url: `https://github.com/primer/react/issues/${number}`,
  }
}

function setGap(audit, checkId, findingId, candidate = false) {
  const rows = candidate ? audit.candidateChecks : audit.checks
  const row = rows.find(item => item.id === checkId)
  row.verdict = 'GAP'
  row.findingId = findingId
  const finding = createFinding({
    id: findingId,
    checkId,
    section: candidate ? candidateChecks[checkId].section : checks[checkId].section,
  })
  const findings = candidate ? audit.candidateFindings : audit.findings
  findings.push(finding)
}

function makeFakeApi({failFirstAttach = false} = {}) {
  const issues = []
  const relationships = new Map()
  let nextNumber = 100
  let nextId = 1
  let createCount = 0
  let attachFailed = false

  const copy = issue => ({...issue})
  const api = {
    async ensureLabel() {},
    async listManagedIssues() {
      return issues.map(copy)
    },
    async createIssue(issue) {
      createCount += 1
      const created = {
        ...issue,
        id: nextId++,
        number: nextNumber++,
        state: 'open',
        html_url: `https://github.com/primer/react/issues/${nextNumber - 1}`,
      }
      issues.push(created)
      return copy(created)
    },
    async updateIssue(number, update) {
      const issue = issues.find(item => item.number === number)
      Object.assign(issue, update)
      return copy(issue)
    },
    async closeIssue(number, update) {
      const issue = issues.find(item => item.number === number)
      Object.assign(issue, update, {state: 'closed'})
      return copy(issue)
    },
    async ensureSubIssue(parentNumber, subIssueId) {
      if (failFirstAttach && !attachFailed) {
        attachFailed = true
        throw new Error('simulated sub-issue API failure')
      }
      const children = relationships.get(parentNumber) ?? new Set()
      children.add(subIssueId)
      relationships.set(parentNumber, children)
    },
  }

  return {
    api,
    issues,
    relationships,
    get createCount() {
      return createCount
    },
  }
}

test('report input requires a matching component scorecard and audited source SHA', () => {
  const audit = createAudit()
  const scorecardMarkdown = createScorecard(audit)
  const validated = validateReportInput({auditJson: JSON.stringify(audit), scorecardMarkdown})
  assert.equal(validated.audit.component, 'TestComponent')
  assert.equal(validated.grade.status, calculateAudit(audit).status)
  assert.throws(
    () => validateReportInput({auditJson: JSON.stringify(audit), scorecardMarkdown: '# Other scorecard'}),
    /component API scorecard heading/,
  )
  assert.throws(
    () =>
      validateReportInput({
        auditJson: JSON.stringify(audit),
        scorecardMarkdown: scorecardMarkdown.replace('100.00', '0.00'),
      }),
    /Scorecard grade must match/,
  )
})

test('validates a provisional score range from the rendered scorecard', () => {
  const audit = createAudit()
  const row = audit.checks.find(item => item.id === 'PART-AS')
  row.verdict = 'NOT MEASURED'
  row.reason = 'No execution evidence was collected'

  const grade = calculateAudit(audit)
  assert.notEqual(grade.status, 'CONCLUSIVE')
  assert.doesNotThrow(() =>
    validateReportInput({auditJson: JSON.stringify(audit), scorecardMarkdown: createScorecard(audit)}),
  )
})

test('accepts the calculator data-file wrapper for one component with spaces in its name', () => {
  const audit = {...createAudit(), component: 'Tooltip V2'}
  const auditPayload = {auditedSourceSha: sourceSha, audits: [audit]}
  const scorecardMarkdown = createScorecard(audit)
  const validated = validateReportInput({auditJson: JSON.stringify(auditPayload), scorecardMarkdown})

  assert.equal(validated.audit.component, 'Tooltip V2')
  assert.deepEqual(validated.auditPayload, auditPayload)
  assert.match(validated.slug, /^tooltip-v2-[a-f0-9]{8}$/)
  assert.equal(componentSlug('Tooltip V2'), validated.slug)
  assert.notEqual(componentSlug('Tooltip-V2'), validated.slug)
  assert.throws(
    () =>
      validateReportInput({
        auditJson: JSON.stringify({...auditPayload, auditedSourceSha: '0'.repeat(40)}),
        scorecardMarkdown,
      }),
    /source SHA must match/,
  )
  assert.throws(
    () =>
      validateReportInput({
        auditJson: JSON.stringify({...auditPayload, audits: [audit, audit]}),
        scorecardMarkdown,
      }),
    /exactly one component audit/,
  )
})

test('plans one stable finding issue per GAP or COVERED check, including candidate gaps', () => {
  const audit = createAudit()
  setGap(audit, 'PART-01', 'F-1')
  const covered = audit.checks.find(row => row.id === 'PART-DOCS')
  covered.verdict = 'COVERED'
  covered.findingId = 'F-1'
  setGap(audit, 'PART-RENDER', 'C-1', true)
  audit.candidateFindings[0].classification = 'ADR GAP'

  const plan = createIssueSyncPlan(audit, [])
  assert.deepEqual(
    plan.findingActions.map(action => action.checkId),
    ['PART-01', 'PART-DOCS', 'PART-RENDER'],
  )
  assert.ok(plan.findingActions.every(action => action.action === 'upsert'))
})

test('reuses an existing stable marker instead of planning a duplicate issue', () => {
  const audit = createAudit()
  setGap(audit, 'MERGE-REF', 'F-1')
  const marker = findingMarker('MERGE-REF')
  const existing = createIssue({number: 17, marker})
  const plan = createIssueSyncPlan(audit, [existing])

  const findingAction = plan.findingActions.find(action => action.checkId === 'MERGE-REF')
  assert.equal(findingAction.action, 'upsert')
  assert.equal(findingAction.issue.number, 17)
  assert.equal(plan.findingActions.filter(action => action.checkId === 'MERGE-REF').length, 1)
})

test('closes an existing finding only when its check explicitly passes', () => {
  const marker = findingMarker('MERGE-REF')
  const existing = createIssue({number: 17, marker})
  const audit = createAudit()
  const plan = createIssueSyncPlan(audit, [existing])
  assert.equal(plan.findingActions[0].action, 'close')

  for (const verdict of ['N/A', 'NOT MEASURED', 'UNRESOLVED']) {
    const incompleteAudit = createAudit()
    const row = incompleteAudit.checks.find(item => item.id === 'MERGE-REF')
    row.verdict = verdict
    if (verdict !== 'PASS') row.reason = `Evidence is ${verdict}`
    assert.equal(createIssueSyncPlan(incompleteAudit, [existing]).findingActions[0].action, 'keep')
  }
})

test('candidate finding issues close only after the candidate check passes', () => {
  const marker = findingMarker('PART-RENDER')
  const audit = createAudit()
  const issue = createIssue({number: 17, marker})

  assert.equal(createIssueSyncPlan(audit, [issue]).findingActions[0].action, 'close')
})

test('keeps an existing issue open while an active contract defect remains for the check', () => {
  const audit = createAudit()
  audit.contractFindings = [
    {
      ...createFinding({id: 'C-1', checkId: 'ACCESS-01', section: checks['ACCESS-01'].section}),
      classification: 'DEFECT',
    },
  ]
  const marker = findingMarker('ACCESS-01')
  const existing = createIssue({number: 17, marker})

  assert.equal(createIssueSyncPlan(audit, [existing]).findingActions[0].action, 'upsert')
})

test('an incomplete or invalid audit cannot produce a plan that closes issues', () => {
  const audit = createAudit()
  audit.checks.pop()
  const marker = findingMarker('MERGE-REF')

  assert.throws(() => createIssueSyncPlan(audit, [createIssue({number: 17, marker})]), /provide exactly one row/)
})

test('a retried sync reuses created issues after a relationship failure', async () => {
  const audit = createAudit()
  setGap(audit, 'MERGE-REF', 'F-1')
  const fake = makeFakeApi({failFirstAttach: true})
  const runUrl = 'https://github.com/primer/react/actions/runs/42'

  await assert.rejects(syncGradeIssues({audit, api: fake.api, runUrl}), /simulated sub-issue API failure/)
  assert.equal(fake.createCount, 3)

  await syncGradeIssues({audit, api: fake.api, runUrl})
  assert.equal(fake.createCount, 3)
  assert.equal(fake.issues.length, 3)
  assert.equal(fake.relationships.get(100).size, 1)
  assert.equal(fake.relationships.get(101).size, 1)
})

test('a passed check closes its existing issue, while grading failure makes no API calls', async () => {
  const audit = createAudit()
  setGap(audit, 'MERGE-REF', 'F-1')
  const fake = makeFakeApi()
  const runUrl = 'https://github.com/primer/react/actions/runs/42'
  await syncGradeIssues({audit, api: fake.api, runUrl})
  const findingIssue = fake.issues.find(issue => issue.body.includes(findingMarker('MERGE-REF')))

  const passedAudit = createAudit()
  await syncGradeIssues({audit: passedAudit, api: fake.api, runUrl})
  assert.equal(fake.issues.find(issue => issue.number === findingIssue.number).state, 'closed')

  const calls = []
  const noWriteApi = Object.fromEntries(
    ['ensureLabel', 'listManagedIssues', 'createIssue', 'updateIssue', 'closeIssue', 'ensureSubIssue'].map(name => [
      name,
      async () => calls.push(name),
    ]),
  )
  const invalidAudit = createAudit()
  invalidAudit.checks.pop()
  await assert.rejects(syncGradeIssues({audit: invalidAudit, api: noWriteApi, runUrl}), /provide exactly one row/)
  assert.deepEqual(calls, [])
})

test('sub-issue attachment is idempotent across retries', async () => {
  const requests = []
  const subIssues = []
  const api = createGitHubApi({
    apiUrl: 'https://api.github.com',
    repository: 'primer/react',
    token: 'test-token',
    fetchImpl: async (url, options) => {
      requests.push({url, options})
      if (options.method === 'GET') return new Response(JSON.stringify(subIssues), {status: 200})
      const body = JSON.parse(options.body)
      subIssues.push({id: body.sub_issue_id})
      return new Response('{}', {status: 201})
    },
  })

  await api.ensureSubIssue(10, 20)
  await api.ensureSubIssue(10, 20)

  assert.equal(requests.filter(request => request.options.method === 'POST').length, 1)
  assert.equal(subIssues.length, 1)
  assert.equal(JSON.parse(requests.find(request => request.options.method === 'POST').options.body).sub_issue_id, 20)
})
