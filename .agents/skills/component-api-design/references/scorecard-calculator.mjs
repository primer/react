import {readFile} from 'node:fs/promises'

export const sections = {
  1: {name: 'Architecture and parts', weight: 20},
  2: {name: 'Root and part substitution', weight: 20},
  3: {name: 'Prop merge behavior', weight: 25},
  4: {name: 'State and shared concepts', weight: 15},
  5: {name: 'Accessibility and evidence', weight: 20},
}

export const checks = {
  'MOD-01': {section: 1, weight: 3},
  'CHILD-01': {section: 1, weight: 3},
  'PART-01': {section: 1, weight: 7},
  'PART-DOCS': {section: 1, weight: 5},
  'STRUCTURE-01': {section: 1, weight: 1},
  'CUSTOM-ELEMENT-01': {section: 1, weight: 1},
  'API-01': {section: 2, weight: 4},
  'PART-AS': {section: 2, weight: 8},
  'PART-RENDER': {section: 2, weight: 8},
  'MERGE-CONFIG': {section: 3, weight: 5},
  'MERGE-HANDLER': {section: 3, weight: 8},
  'MERGE-CLASS': {section: 3, weight: 3},
  'MERGE-STYLE-ATTR': {section: 3, weight: 4},
  'MERGE-REF': {section: 3, weight: 3},
  'MERGE-BEHAVIOR': {section: 3, weight: 2},
  'STATE-CALLBACK': {section: 4, weight: 8},
  'NAMES-DEFAULTS': {section: 4, weight: 5},
  'STATE-OWNER': {section: 4, weight: 2},
  'ACCESS-01': {section: 5, weight: 4},
  'LIVE-01': {section: 5, weight: 1},
  'WARN-01': {section: 5, weight: 1},
  'SELECTOR-01': {section: 5, weight: 2},
  'STYLE-01': {section: 5, weight: 2},
  'RESP-01': {section: 5, weight: 1},
  'TYPE-01': {section: 5, weight: 1},
  'EXPORT-01': {section: 5, weight: 1},
  'TEST-01': {section: 5, weight: 1},
  'SNAPSHOT-01': {section: 5, weight: 1},
  'INTERACTION-01': {section: 5, weight: 1},
  'MIG-01': {section: 5, weight: 4},
}

const verdicts = new Set(['PASS', 'GAP', 'N/A', 'COVERED', 'DEFERRED', 'NOT MEASURED', 'UNRESOLVED'])
const evidenceClasses = new Set([
  'SOURCE VERIFIED',
  'EXECUTION VERIFIED',
  'BEHAVIOR VERIFIED',
  'AGENT JUDGMENT',
  'PENDING HUMAN',
])
const severityOrder = ['NIT', 'FIX', 'BLOCK']

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

function countBy(items, predicate) {
  return items.filter(predicate).length
}

function calculateSectionCap(findings) {
  const blocks = countBy(findings, finding => finding.severity === 'BLOCK')
  if (blocks >= 4) return 1
  if (blocks === 3) return 2
  if (blocks === 2) return 2.5
  if (blocks === 1) return 3

  const fixesAndNits = countBy(findings, finding => finding.severity === 'FIX' || finding.severity === 'NIT')
  if (fixesAndNits >= 5) return 2
  if (fixesAndNits >= 3) return 3
  if (fixesAndNits >= 1) return 4
  return 5
}

export function letterGrade(score) {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function capAtD(grade) {
  return ['A', 'B', 'C'].includes(grade) ? 'D' : grade
}

function validateAudit(audit) {
  assert(audit && typeof audit === 'object', 'Audit must be an object')
  assert(typeof audit.component === 'string' && audit.component.length > 0, 'Audit component is required')
  assert(/^[0-9a-f]{40}$/i.test(audit.sourceSha), `${audit.component}: sourceSha must be a full Git commit SHA`)
  assert(typeof audit.pendingHuman === 'boolean', `${audit.component}: pendingHuman must be a boolean`)
  assert(Array.isArray(audit.checks), `${audit.component}: checks must be an array`)
  assert(Array.isArray(audit.findings), `${audit.component}: findings must be an array`)
  assert(Array.isArray(audit.contractFindings ?? []), `${audit.component}: contractFindings must be an array`)

  const checkRows = new Map()
  for (const row of audit.checks) {
    assert(row && typeof row === 'object', `${audit.component}: each check row must be an object`)
    assert(checks[row.id], `${audit.component}: unknown check ID ${row.id}`)
    assert(!checkRows.has(row.id), `${audit.component}: duplicate check row ${row.id}`)
    assert(verdicts.has(row.verdict), `${audit.component}: invalid verdict for ${row.id}: ${row.verdict}`)
    assert(
      typeof row.evidence === 'string' && row.evidence.length > 0,
      `${audit.component}: evidence is required for ${row.id}`,
    )
    assert(evidenceClasses.has(row.evidenceClass), `${audit.component}: valid evidenceClass is required for ${row.id}`)

    if (row.evidenceClass === 'PENDING HUMAN') {
      assert(
        row.verdict === 'UNRESOLVED',
        `${audit.component}: PENDING HUMAN evidence must remain UNRESOLVED for ${row.id}`,
      )
      assert(audit.pendingHuman, `${audit.component}: pendingHuman must be true when ${row.id} awaits human review`)
    }

    if (row.verdict === 'PASS' && ['TYPE-01', 'TEST-01', 'INTERACTION-01'].includes(row.id)) {
      assert(
        row.evidenceClass === 'EXECUTION VERIFIED',
        `${audit.component}: ${row.id} PASS requires EXECUTION VERIFIED evidence`,
      )
    }

    if (row.verdict === 'N/A') {
      assert(
        typeof row.reason === 'string' && row.reason.length > 0,
        `${audit.component}: N/A reason is required for ${row.id}`,
      )
    }

    if (row.verdict === 'DEFERRED') {
      assert(row.id === 'PART-RENDER', `${audit.component}: only PART-RENDER may be DEFERRED`)
      assert(
        typeof row.reason === 'string' && row.reason.length > 0,
        `${audit.component}: DEFERRED reason is required for ${row.id}`,
      )
    }

    if (row.verdict === 'NOT MEASURED' || row.verdict === 'UNRESOLVED') {
      assert(
        typeof row.reason === 'string' && row.reason.length > 0,
        `${audit.component}: reason is required for ${row.id} ${row.verdict}`,
      )
    }

    if (row.verdict === 'GAP' || row.verdict === 'COVERED') {
      assert(
        typeof row.findingId === 'string' && row.findingId.length > 0,
        `${audit.component}: findingId is required for ${row.id} ${row.verdict}`,
      )
    }

    checkRows.set(row.id, row)
  }

  const expectedCheckIds = Object.keys(checks).sort()
  const actualCheckIds = [...checkRows.keys()].sort()
  assert(
    expectedCheckIds.length === actualCheckIds.length &&
      expectedCheckIds.every((id, index) => id === actualCheckIds[index]),
    `${audit.component}: provide exactly one row for every check ID`,
  )

  const findings = new Map()
  for (const finding of audit.findings) {
    assert(finding && typeof finding === 'object', `${audit.component}: each target finding must be an object`)
    assert(typeof finding.id === 'string' && finding.id.length > 0, `${audit.component}: target finding ID is required`)
    assert(!findings.has(finding.id), `${audit.component}: duplicate target finding ID ${finding.id}`)
    assert(finding.classification === 'ADR GAP', `${audit.component}: target findings must be ADR GAPs`)
    assert(
      severityOrder.includes(finding.severity) && finding.severity !== 'BLOCK',
      `${audit.component}: target gaps cannot be BLOCKs`,
    )
    assert(checks[finding.checkId], `${audit.component}: finding ${finding.id} has unknown check ${finding.checkId}`)
    assert(
      finding.section === checks[finding.checkId].section,
      `${audit.component}: finding ${finding.id} is not in its owning section`,
    )
    assert(
      finding.status === 'OPEN' || finding.status === 'CLOSED' || finding.status === 'DEFERRED',
      `${audit.component}: finding ${finding.id} needs OPEN, CLOSED, or DEFERRED status`,
    )
    assert(
      typeof finding.title === 'string' && finding.title.length > 0,
      `${audit.component}: finding ${finding.id} needs a title`,
    )
    assert(
      typeof finding.reachableUseCase === 'string' && finding.reachableUseCase.length > 0,
      `${audit.component}: finding ${finding.id} needs a reachable use case`,
    )
    assert(
      typeof finding.observedGap === 'string' && finding.observedGap.length > 0,
      `${audit.component}: finding ${finding.id} needs an observed gap`,
    )
    assert(
      typeof finding.additiveFix === 'string' && finding.additiveFix.length > 0,
      `${audit.component}: finding ${finding.id} needs an additive fix`,
    )
    assert(
      Array.isArray(finding.citations) && finding.citations.length > 0,
      `${audit.component}: finding ${finding.id} needs pinned citations`,
    )
    for (const citation of finding.citations) {
      assert(
        typeof citation.path === 'string' && citation.path.length > 0,
        `${audit.component}: finding ${finding.id} has a citation without a path`,
      )
      assert(
        typeof citation.line === 'string' && citation.line.length > 0,
        `${audit.component}: finding ${finding.id} has a citation without a line`,
      )
      assert(
        citation.sha === audit.sourceSha,
        `${audit.component}: finding ${finding.id} citation SHA must match sourceSha`,
      )
    }
    const owner = checkRows.get(finding.checkId)
    if (finding.status === 'DEFERRED') {
      assert(
        finding.checkId === 'PART-RENDER' && owner?.verdict === 'DEFERRED' && owner.findingId === finding.id,
        `${audit.component}: deferred finding ${finding.id} must be owned by a DEFERRED PART-RENDER row`,
      )
    } else {
      assert(
        owner?.verdict === 'GAP' && owner.findingId === finding.id,
        `${audit.component}: finding ${finding.id} must own one GAP row`,
      )
    }
    findings.set(finding.id, finding)
  }

  for (const row of checkRows.values()) {
    if (row.verdict === 'GAP') {
      const finding = findings.get(row.findingId)
      assert(finding?.checkId === row.id, `${audit.component}: ${row.id} references no matching owning finding`)
    }

    if (row.verdict === 'COVERED') {
      assert(findings.has(row.findingId), `${audit.component}: ${row.id} references no target finding`)
    }

    if (row.verdict === 'DEFERRED' && row.findingId) {
      assert(findings.has(row.findingId), `${audit.component}: ${row.id} references no target finding`)
    }
  }

  for (const finding of audit.contractFindings ?? []) {
    assert(finding && typeof finding === 'object', `${audit.component}: each contract finding must be an object`)
    assert(
      typeof finding.id === 'string' && finding.id.length > 0,
      `${audit.component}: contract finding ID is required`,
    )
    assert(finding.classification === 'DEFECT', `${audit.component}: contract findings must be DEFECTs`)
    assert(
      severityOrder.includes(finding.severity),
      `${audit.component}: invalid severity for contract finding ${finding.id}`,
    )
    assert(checks[finding.checkId], `${audit.component}: contract finding ${finding.id} has unknown check`)
    assert(
      finding.section === checks[finding.checkId].section,
      `${audit.component}: contract finding ${finding.id} has the wrong owning section`,
    )
    assert(
      finding.status === 'OPEN' || finding.status === 'CLOSED',
      `${audit.component}: contract finding ${finding.id} needs OPEN or CLOSED status`,
    )
    assert(
      typeof finding.title === 'string' && finding.title.length > 0,
      `${audit.component}: contract finding ${finding.id} needs a title`,
    )
    assert(
      typeof finding.reachableUseCase === 'string' && finding.reachableUseCase.length > 0,
      `${audit.component}: contract finding ${finding.id} needs a reachable use case`,
    )
    assert(
      typeof finding.observedGap === 'string' && finding.observedGap.length > 0,
      `${audit.component}: contract finding ${finding.id} needs an observed defect`,
    )
    assert(
      typeof finding.additiveFix === 'string' && finding.additiveFix.length > 0,
      `${audit.component}: contract finding ${finding.id} needs a compatible fix`,
    )
    assert(
      Array.isArray(finding.citations) && finding.citations.length > 0,
      `${audit.component}: contract finding ${finding.id} needs pinned citations`,
    )
    for (const citation of finding.citations) {
      assert(
        typeof citation.path === 'string' && citation.path.length > 0,
        `${audit.component}: contract finding ${finding.id} has a citation without a path`,
      )
      assert(
        typeof citation.line === 'string' && citation.line.length > 0,
        `${audit.component}: contract finding ${finding.id} has a citation without a line`,
      )
      assert(
        citation.sha === audit.sourceSha,
        `${audit.component}: contract finding ${finding.id} citation SHA must match sourceSha`,
      )
    }
  }

  const allFindingIds = [...audit.findings, ...(audit.contractFindings ?? [])].map(finding => finding.id)
  assert(
    new Set(allFindingIds).size === allFindingIds.length,
    `${audit.component}: finding IDs must be unique across both finding lists`,
  )
  const deferredFindingCount = countBy(audit.findings, finding => finding.status === 'DEFERRED')
  const rawFindingCount =
    countBy([...checkRows.values()], row => row.verdict === 'GAP' || row.verdict === 'COVERED') +
    (audit.contractFindings ?? []).length
  assert(
    rawFindingCount + deferredFindingCount >= allFindingIds.length,
    `${audit.component}: raw observations and deferred findings cannot be below distinct finding count`,
  )
  return rawFindingCount
}

function summarize(audit, {sensitivity = false, renderMode = 'scored'} = {}) {
  const rawFindingCount = validateAudit(audit)
  const rows = new Map(audit.checks.map(row => [row.id, row]))
  const targetFindings = audit.findings.filter(finding => finding.status === 'OPEN')
  const contractFindings = (audit.contractFindings ?? []).filter(finding => finding.status === 'OPEN')
  const allOpenFindings = [...targetFindings, ...contractFindings]
  const forcedPass = sensitivity
    ? new Set(contractFindings.filter(finding => finding.severity === 'BLOCK').map(finding => finding.id))
    : new Set()
  const activeBlocks = sensitivity
    ? allOpenFindings.filter(finding => finding.severity === 'BLOCK' && !forcedPass.has(finding.id))
    : allOpenFindings.filter(finding => finding.severity === 'BLOCK')

  const sectionResults = Object.entries(sections).map(([sectionId, section]) => {
    const sectionNumber = Number(sectionId)
    const sectionRows = Object.entries(checks)
      .filter(([, check]) => check.section === sectionNumber)
      .map(([id]) => rows.get(id))
    const applicableRows = sectionRows.filter(row => row.verdict !== 'N/A' && row.verdict !== 'DEFERRED')
    const applicableWeight = applicableRows.reduce((total, row) => total + checks[row.id].weight, 0)
    const earnedWeight = applicableRows.reduce((total, row) => {
      const fixedBySensitivity = sensitivity && row.verdict === 'GAP' && forcedPass.has(row.findingId)
      return total + (row.verdict === 'PASS' || fixedBySensitivity ? checks[row.id].weight : 0)
    }, 0)
    const unknownWeight = applicableRows.reduce(
      (total, row) => total + (['NOT MEASURED', 'UNRESOLVED'].includes(row.verdict) ? checks[row.id].weight : 0),
      0,
    )
    const limited = applicableWeight < section.weight / 2
    const sectionFindings = allOpenFindings.filter(
      finding => finding.section === sectionNumber && !(sensitivity && forcedPass.has(finding.id)),
    )
    const rawScoreRange =
      applicableWeight === 0
        ? null
        : {
            min: (5 * earnedWeight) / applicableWeight,
            max: (5 * (earnedWeight + unknownWeight)) / applicableWeight,
          }
    const cap = calculateSectionCap(sectionFindings)
    const scoreRange =
      rawScoreRange === null
        ? null
        : {
            min: Math.min(rawScoreRange.min, cap),
            max: Math.min(rawScoreRange.max, cap),
          }
    const score = scoreRange && unknownWeight === 0 ? scoreRange.min : null
    return {
      id: sectionNumber,
      name: section.name,
      weight: section.weight,
      applicableWeight,
      earnedWeight,
      unknownWeight,
      limited,
      cap,
      score,
      scoreRange,
      findings: sectionFindings.length,
    }
  })

  const scoredSections = sectionResults.filter(section => section.scoreRange !== null)
  const scoredWeight = scoredSections.reduce((total, section) => total + section.applicableWeight, 0)
  const overallScoreRange =
    scoredWeight === 0
      ? null
      : {
          min:
            (100 *
              scoredSections.reduce(
                (total, section) => total + (section.applicableWeight * section.scoreRange.min) / 5,
                0,
              )) /
            scoredWeight,
          max:
            (100 *
              scoredSections.reduce(
                (total, section) => total + (section.applicableWeight * section.scoreRange.max) / 5,
                0,
              )) /
            scoredWeight,
        }
  const scoreRange =
    overallScoreRange === null
      ? null
      : {
          min: Number(overallScoreRange.min.toFixed(2)),
          max: Number(overallScoreRange.max.toFixed(2)),
        }
  const overallScore = scoreRange && scoreRange.min === scoreRange.max ? scoreRange.min : null
  const uncappedGrade = overallScore === null ? null : letterGrade(overallScore)
  const gradeRange = scoreRange
    ? {
        min: letterGrade(scoreRange.min),
        max: letterGrade(scoreRange.max),
      }
    : null
  const grade = uncappedGrade && activeBlocks.length > 0 ? capAtD(uncappedGrade) : uncappedGrade
  const cappedGradeRange =
    gradeRange && activeBlocks.length > 0 ? {min: capAtD(gradeRange.min), max: capAtD(gradeRange.max)} : gradeRange
  const applicableCheckWeight = audit.checks.reduce(
    (total, row) => total + (!['N/A', 'DEFERRED'].includes(row.verdict) ? checks[row.id].weight : 0),
    0,
  )
  const measuredCheckWeight = audit.checks.reduce(
    (total, row) => total + (['PASS', 'GAP', 'COVERED'].includes(row.verdict) ? checks[row.id].weight : 0),
    0,
  )
  const hasIncompleteEvidence =
    sectionResults.some(section => section.limited) ||
    audit.checks.some(row => row.verdict === 'NOT MEASURED' || row.verdict === 'UNRESOLVED') ||
    audit.pendingHuman === true
  const status = scoreRange === null ? 'UNKNOWN' : hasIncompleteEvidence ? 'PROVISIONAL' : 'CONCLUSIVE'
  const scoredTargetFindings = (audit.findings ?? []).filter(finding => finding.status !== 'DEFERRED')
  const allDistinctFindings = [...scoredTargetFindings, ...(audit.contractFindings ?? [])]
  const sensitivityResult = sensitivity ? null : summarize(audit, {sensitivity: true, renderMode})

  return {
    component: audit.component,
    renderMode,
    status,
    overallScore,
    scoreRange,
    uncappedGrade,
    grade,
    gradeRange: cappedGradeRange,
    blockCount: allOpenFindings.filter(finding => finding.severity === 'BLOCK').length,
    distinctTargetGaps: scoredTargetFindings.length,
    deferredTargetGaps: (audit.findings ?? []).filter(finding => finding.status === 'DEFERRED').length,
    deferredChecks: countBy(audit.checks, row => row.verdict === 'DEFERRED'),
    distinctDefects: (audit.contractFindings ?? []).length,
    distinctFindings: allDistinctFindings.length,
    rawFindings: rawFindingCount,
    scoredSectionWeight: scoredWeight,
    coveragePercent: Number(scoredWeight.toFixed(2)),
    measuredCheckWeight,
    applicableCheckWeight,
    checkEvidenceCoveragePercent:
      applicableCheckWeight === 0 ? null : Number(((100 * measuredCheckWeight) / applicableCheckWeight).toFixed(2)),
    sections: sectionResults.map(section => ({
      ...section,
      score: section.score === null ? null : Number(section.score.toFixed(2)),
      scoreRange:
        section.scoreRange === null
          ? null
          : {
              min: Number(section.scoreRange.min.toFixed(2)),
              max: Number(section.scoreRange.max.toFixed(2)),
            },
    })),
    sensitivity: sensitivityResult
      ? {
          blockCount: allOpenFindings.filter(finding => finding.severity === 'BLOCK').length,
          overallScore: sensitivityResult.overallScore,
          scoreRange: sensitivityResult.scoreRange,
          grade: sensitivityResult.grade,
          gradeRange: sensitivityResult.gradeRange,
          status: sensitivityResult.status,
        }
      : undefined,
  }
}

function applyRenderMode(audit, renderMode) {
  assert(['scored', 'deferred'].includes(renderMode), `Invalid renderMode: ${renderMode}`)
  const renderRow = audit.checks.find(row => row.id === 'PART-RENDER')
  if (renderMode === 'scored') {
    assert(
      renderRow?.verdict !== 'DEFERRED',
      `${audit.component}: PART-RENDER cannot be DEFERRED in scored mode; use renderMode "deferred"`,
    )
    return audit
  }

  if (renderRow?.verdict !== 'GAP') return audit

  const deferredAudit = structuredClone(audit)
  const deferredRow = deferredAudit.checks.find(row => row.id === 'PART-RENDER')
  deferredRow.verdict = 'DEFERRED'
  deferredRow.reason = 'Comparative mode: PART-RENDER is excluded from scoring; the target gap remains visible.'
  const deferredFinding = deferredAudit.findings.find(finding => finding.id === deferredRow.findingId)
  assert(
    deferredFinding?.checkId === 'PART-RENDER',
    `${audit.component}: PART-RENDER must have its own finding to be deferred independently`,
  )
  deferredFinding.status = 'DEFERRED'
  return deferredAudit
}

export function calculateAudit(audit, {renderMode = 'scored'} = {}) {
  return summarize(applyRenderMode(audit, renderMode), {renderMode})
}

export async function readAuditData(path) {
  const data = JSON.parse(await readFile(path, 'utf8'))
  assert(data && Array.isArray(data.audits), 'Audit data file must contain an audits array')
  return data.audits
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , dataPath, ...args] = process.argv
  let component
  let renderMode = 'scored'
  for (let index = 0; index < args.length; index++) {
    if (args[index] === '--render-mode') {
      renderMode = args[index + 1]
      index++
    } else if (component === undefined) {
      component = args[index]
    } else {
      console.error(`Unknown argument: ${args[index]}`)
      process.exitCode = 2
      break
    }
  }
  if (!dataPath) {
    console.error('Usage: node scorecard-calculator.mjs <audit-data.json> [component] [--render-mode scored|deferred]')
    process.exitCode = 2
  } else if (process.exitCode !== 2) {
    try {
      const audits = await readAuditData(dataPath)
      const selectedAudits = component ? audits.filter(audit => audit.component === component) : audits
      assert(selectedAudits.length > 0, `No audit found${component ? ` for ${component}` : ''}`)
      console.log(
        JSON.stringify(
          selectedAudits.map(audit => calculateAudit(audit, {renderMode})),
          null,
          2,
        ),
      )
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
}
