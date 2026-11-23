import test from 'node:test'
import assert from 'node:assert/strict'
import {calculateAudit, candidateChecks, checks, letterGrade, sections} from './scorecard-calculator.mjs'

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
      evidenceClass: ['TYPE-01', 'TEST-01', 'INTERACTION-01'].includes(id) ? 'EXECUTION VERIFIED' : 'SOURCE VERIFIED',
      evidence: `Verified ${id}`,
    })),
    findings: [],
    candidateChecks: [
      {id: 'PART-RENDER', verdict: 'PASS', evidenceClass: 'SOURCE VERIFIED', evidence: 'Candidate requirement is present'},
    ],
    candidateFindings: [],
    contractFindings: [],
  }
}

test('grade thresholds map 78.5 to C and 80 to B', () => {
  assert.equal(letterGrade(78.5), 'C')
  assert.equal(letterGrade(79.99), 'C')
  assert.equal(letterGrade(80), 'B')
})

test('a fully N/A section is limited and has no numeric score', () => {
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

test('a limited section still scores and retains its GAP', () => {
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
  const result = calculateAudit(audit)
  const stateSection = result.sections.find(section => section.id === 4)
  assert.equal(stateSection.limited, true)
  assert.equal(stateSection.score, 0)
  assert.equal(stateSection.applicableWeight, checks['NAMES-DEFAULTS'].weight)
  assert.equal(result.scoredSectionWeight, 82)
})

test('a COVERED target check remains in the denominator without adding a distinct finding', () => {
  const audit = createAudit()
  const partCheck = audit.checks.find(row => row.id === 'PART-01')
  partCheck.verdict = 'GAP'
  partCheck.findingId = 'F-1'
  const docsCheck = audit.checks.find(row => row.id === 'PART-DOCS')
  docsCheck.verdict = 'COVERED'
  docsCheck.findingId = 'F-1'
  audit.findings = [createFinding({id: 'F-1', checkId: 'PART-01', section: 1})]

  const result = calculateAudit(audit)
  const architectureSection = result.sections.find(section => section.id === 1)

  assert.equal(architectureSection.applicableWeight, sections[1].weight)
  assert.equal(architectureSection.earnedWeight, 8)
  assert.equal(architectureSection.score, 2)
  assert.equal(result.distinctTargetGaps, 1)
  assert.equal(result.rawFindings, 2)
})

test('candidate checks remain visible without changing the grade or active denominator', () => {
  const audit = createAudit()
  const candidate = audit.candidateChecks[0]
  candidate.verdict = 'GAP'
  candidate.findingId = 'C-1'
  audit.candidateFindings = [createFinding({id: 'C-1', checkId: 'PART-RENDER', section: 2})]

  const result = calculateAudit(audit)
  const substitution = result.sections.find(section => section.id === 2)
  const mergeSection = result.sections.find(section => section.id === 3)

  assert.equal(result.overallScore, 100)
  assert.equal(result.activeRubricWeight, 92)
  assert.equal(result.applicableCheckWeight, 92)
  assert.equal(result.distinctTargetGaps, 0)
  assert.equal(result.candidateGapCount, 1)
  assert.equal(result.candidates[0].proposedWeight, 8)
  assert.equal(result.candidateFindings.length, 1)
  assert.equal(substitution.applicableWeight, 12)
  assert.equal(substitution.score, 5)
  assert.equal(mergeSection.applicableWeight, 25)
  assert.equal(mergeSection.earnedWeight, 25)
  assert.equal(mergeSection.score, 5)
})

test('candidate checks must be fully represented and findings cannot enter the active score', () => {
  const audit = createAudit()
  delete audit.candidateChecks[0]
  assert.throws(() => calculateAudit(audit), /each candidate check must be an object/)

  const missingFinding = createAudit()
  missingFinding.candidateChecks[0].verdict = 'GAP'
  assert.throws(() => calculateAudit(missingFinding), /findingId is required for candidate PART-RENDER GAP/)
})

test('active COVERED checks cannot be owned by an unweighted candidate finding', () => {
  const audit = createAudit()
  audit.candidateChecks[0].verdict = 'GAP'
  audit.candidateChecks[0].findingId = 'C-1'
  audit.candidateFindings = [createFinding({id: 'C-1', checkId: 'PART-RENDER', section: 2})]
  const activeCheck = audit.checks.find(row => row.id === 'PART-01')
  activeCheck.verdict = 'COVERED'
  activeCheck.findingId = 'C-1'

  assert.throws(() => calculateAudit(audit), /active PART-01 must reference an active target finding/)
})

test('unmeasured candidate checks do not make an active grade provisional', () => {
  const audit = createAudit()
  const candidate = audit.candidateChecks[0]
  candidate.verdict = 'UNRESOLVED'
  candidate.evidenceClass = 'PENDING HUMAN'
  candidate.reason = 'The candidate criterion needs maintainer review'

  const result = calculateAudit(audit)
  assert.equal(result.status, 'CONCLUSIVE')
  assert.equal(result.overallScore, 100)
  assert.equal(result.candidates[0].verdict, 'UNRESOLVED')
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

test('pendingHuman must be present and boolean', () => {
  const missing = createAudit()
  delete missing.pendingHuman
  assert.throws(() => calculateAudit(missing), /pendingHuman must be a boolean/)

  const nonBoolean = createAudit()
  nonBoolean.pendingHuman = 'false'
  assert.throws(() => calculateAudit(nonBoolean), /pendingHuman must be a boolean/)
})

test('a PASS cannot use PENDING HUMAN evidence', () => {
  const audit = createAudit()
  audit.pendingHuman = true
  const row = audit.checks.find(check => check.id === 'PART-01')
  row.evidenceClass = 'PENDING HUMAN'
  assert.throws(() => calculateAudit(audit), /PENDING HUMAN evidence must remain UNRESOLVED/)
})

test('pending human review remains provisional', () => {
  const audit = createAudit()
  audit.pendingHuman = true
  const row = audit.checks.find(check => check.id === 'NAMES-DEFAULTS')
  row.verdict = 'UNRESOLVED'
  row.evidenceClass = 'PENDING HUMAN'
  row.reason = 'A maintainer decision is still required'
  const result = calculateAudit(audit)
  assert.equal(result.status, 'PROVISIONAL')
  assert.equal(result.overallScore, null)
})

test('TYPE-01, TEST-01, and INTERACTION-01 PASS require execution evidence', () => {
  for (const id of ['TYPE-01', 'TEST-01', 'INTERACTION-01']) {
    const audit = createAudit()
    audit.checks.find(check => check.id === id).evidenceClass = 'SOURCE VERIFIED'
    assert.throws(() => calculateAudit(audit), new RegExp(`${id} PASS requires EXECUTION VERIFIED evidence`))
  }
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
  audit.contractFindings = [
    createFinding({id: 'C-1', checkId: 'API-01', section: 2, classification: 'DEFECT', severity: 'BLOCK'}),
  ]
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
  assert.deepEqual(evidenceSection.scoreRange, {min: 4.75, max: 5})
  assert.equal(result.overallScore, null)
  assert.deepEqual(result.scoreRange, {min: 98.91, max: 100})
  assert.deepEqual(result.gradeRange, {min: 'A', max: 'A'})
  assert.equal(result.checkEvidenceCoveragePercent, 98.91)
  assert.equal(result.status, 'PROVISIONAL')
})

test('fixing a GAP in an unchanged limited section cannot lower the score', () => {
  const audit = createAudit()
  for (const row of audit.checks.filter(row => checks[row.id].section === 4)) {
    row.verdict = 'N/A'
    row.reason = 'No other state/shared concept is present'
  }
  const namesCheck = audit.checks.find(row => row.id === 'NAMES-DEFAULTS')
  namesCheck.verdict = 'GAP'
  namesCheck.evidenceClass = 'SOURCE VERIFIED'
  namesCheck.findingId = 'F-1'
  audit.findings = [createFinding({id: 'F-1', checkId: 'NAMES-DEFAULTS', section: 4})]

  const before = calculateAudit(audit)
  namesCheck.verdict = 'PASS'
  delete namesCheck.findingId
  audit.findings = []
  const after = calculateAudit(audit)

  assert.equal(before.sections.find(section => section.id === 4).limited, true)
  assert.equal(after.sections.find(section => section.id === 4).limited, true)
  assert.equal(before.applicableCheckWeight, after.applicableCheckWeight)
  assert.ok(after.scoreRange.min >= before.scoreRange.min)
  assert.ok(after.scoreRange.max >= before.scoreRange.max)
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
  assert.equal(sectionWeights, 92)
  assert.equal(Object.values(candidateChecks).reduce((sum, check) => sum + check.proposedWeight, 0), 8)
  for (const [sectionId, section] of Object.entries(sections)) {
    const weight = Object.values(checks)
      .filter(check => check.section === Number(sectionId))
      .reduce((sum, check) => sum + check.weight, 0)
    assert.equal(weight, section.weight)
  }
  assert.equal(
    Object.values(sections).reduce((sum, section) => sum + section.weight, 0) +
      Object.values(candidateChecks).reduce((sum, check) => sum + check.proposedWeight, 0),
    100,
  )
})

test('candidate checks retain their verification class, severity, and source', () => {
  assert.deepEqual(candidateChecks['PART-RENDER'], {
    section: 2,
    proposedWeight: 8,
    verificationClass: 'semi',
    severity: 'FIX',
    source: 'Pinned composition gist',
    title: 'Element and function render forms',
  })
})
