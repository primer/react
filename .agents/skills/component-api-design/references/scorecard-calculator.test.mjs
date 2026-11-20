import test from 'node:test'
import assert from 'node:assert/strict'
import {calculateAudit, checks, letterGrade, sections} from './scorecard-calculator.mjs'

const sourceSha = '2128032dca65a1bd565fe382c2e91c638c6473a4'

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
    observedGap: 'The test fixture records a missing requirement',
    additiveFix: 'Add the requirement while preserving the existing API',
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
      evidenceClass: 'SOURCE VERIFIED',
      evidence: `Verified ${id}`,
    })),
    findings: [],
    contractFindings: [],
  }
}

test('grade thresholds map 78.5 to C and 80 to B', () => {
  assert.equal(letterGrade(78.5), 'C')
  assert.equal(letterGrade(79.99), 'C')
  assert.equal(letterGrade(80), 'B')
})

test('a mostly N/A section is limited and cannot receive 5/5', () => {
  const audit = createAudit()
  for (const row of audit.checks.filter(row => checks[row.id].section === 4)) {
    row.verdict = 'N/A'
    row.reason = 'This fixture has no state or shared concept'
  }
  const result = calculateAudit(audit)
  const stateSection = result.sections.find(section => section.id === 4)
  assert.equal(stateSection.limited, true)
  assert.equal(stateSection.score, null)
  assert.equal(result.status, 'PROVISIONAL')
})

test('a narrow section with a scored GAP is not hidden as limited', () => {
  const audit = createAudit()
  const stateChecks = audit.checks.filter(row => checks[row.id].section === 4)
  for (const row of stateChecks) {
    row.verdict = 'N/A'
    row.reason = 'This fixture has no state or shared concept'
  }
  const namesCheck = stateChecks.find(row => row.id === 'NAMES-DEFAULTS')
  namesCheck.verdict = 'GAP'
  namesCheck.evidenceClass = 'SOURCE VERIFIED'
  namesCheck.findingId = 'F-1'
  audit.findings = [createFinding({id: 'F-1', checkId: 'NAMES-DEFAULTS', section: 4})]
  const stateSection = calculateAudit(audit).sections.find(section => section.id === 4)
  assert.equal(stateSection.limited, false)
  assert.equal(stateSection.score, 0)
})

test('a GAP without a linked finding is rejected', () => {
  const audit = createAudit()
  const row = audit.checks.find(check => check.id === 'PART-01')
  row.verdict = 'GAP'
  row.evidenceClass = 'SOURCE VERIFIED'
  assert.throws(() => calculateAudit(audit), /findingId is required/)
})

test('every check row requires an evidence class', () => {
  const audit = createAudit()
  delete audit.checks.find(row => row.id === 'LIVE-01').evidenceClass
  assert.throws(() => calculateAudit(audit), /valid evidenceClass is required for LIVE-01/)
})

test('findings require citations pinned to the audited source SHA', () => {
  const audit = createAudit()
  const row = audit.checks.find(check => check.id === 'PART-01')
  row.verdict = 'GAP'
  row.findingId = 'F-1'
  audit.findings = [createFinding({id: 'F-1', checkId: 'PART-01', section: 1})]
  audit.findings[0].citations[0].sha = '0000000000000000000000000000000000000000'
  assert.throws(() => calculateAudit(audit), /citation SHA must match sourceSha/)
})

test('an open BLOCK caps the grade and sensitivity removes only that cap', () => {
  const audit = createAudit()
  audit.contractFindings = [createFinding({id: 'C-1', checkId: 'API-01', section: 2, classification: 'DEFECT', severity: 'BLOCK'})]
  const result = calculateAudit(audit)
  assert.equal(result.blockCount, 1)
  assert.equal(result.grade, 'D')
  assert.deepEqual(result.sensitivity, {
    blockCount: 1,
    overallScore: 100,
    scoreRange: {min: 100, max: 100},
    grade: 'A',
    gradeRange: {min: 'A', max: 'A'},
    status: 'CONCLUSIVE',
  })
})

test('NOT MEASURED remains unscored and produces a provisional score range', () => {
  const audit = createAudit()
  const testCheck = audit.checks.find(row => row.id === 'TEST-01')
  testCheck.verdict = 'NOT MEASURED'
  testCheck.reason = 'The focused test command was not run'
  const result = calculateAudit(audit)
  const evidenceSection = result.sections.find(section => section.id === 5)
  assert.equal(evidenceSection.score, null)
  assert.deepEqual(evidenceSection.scoreRange, {min: 4.25, max: 5})
  assert.equal(result.overallScore, null)
  assert.deepEqual(result.scoreRange, {min: 97, max: 100})
  assert.deepEqual(result.gradeRange, {min: 'A', max: 'A'})
  assert.equal(result.checkEvidenceCoveragePercent, 97)
  assert.equal(result.status, 'PROVISIONAL')
})

test('section ceilings count distinct findings while preserving raw observations', () => {
  const audit = createAudit()
  const ids = ['LIVE-01', 'RESP-01', 'TYPE-01']
  audit.findings = ids.map((checkId, index) => {
    const id = `F-${index + 1}`
    const row = audit.checks.find(check => check.id === checkId)
    row.verdict = 'GAP'
    row.findingId = id
    return createFinding({id, checkId, section: 5})
  })
  const covered = audit.checks.find(check => check.id === 'ACCESS-01')
  covered.verdict = 'COVERED'
  covered.findingId = 'F-1'
  const result = calculateAudit(audit)
  const evidenceSection = result.sections.find(section => section.id === 5)
  assert.equal(result.distinctTargetGaps, 3)
  assert.equal(result.distinctDefects, 0)
  assert.equal(result.distinctFindings, 3)
  assert.equal(result.rawFindings, 4)
  assert.equal(evidenceSection.cap, 3)
  assert.equal(evidenceSection.score, 3)
})

test('every N/A check requires a written reason', () => {
  const audit = createAudit()
  audit.checks.find(row => row.id === 'LIVE-01').verdict = 'N/A'
  assert.throws(() => calculateAudit(audit), /N\/A reason is required/)
})

test('section weights and check weights cover the full rubric', () => {
  const sectionWeights = Object.values(sections).reduce((sum, section) => sum + section.weight, 0)
  assert.equal(sectionWeights, 100)
  for (const [sectionId, section] of Object.entries(sections)) {
    const weight = Object.values(checks)
      .filter(check => check.section === Number(sectionId))
      .reduce((sum, check) => sum + check.weight, 0)
    assert.equal(weight, section.weight)
  }
})
