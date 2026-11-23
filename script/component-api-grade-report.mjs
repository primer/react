import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {pathToFileURL} from 'node:url'
import {calculateAudit} from '../.agents/skills/component-api-design/references/scorecard-calculator.mjs'

export const managedLabel = 'component-api-grade'
const maxInputLength = 30_000
const componentMarker = slug => `<!-- component-api-grade:component:${slug} -->`
const findingMarker = (slug, checkId) => `<!-- component-api-grade:finding:${slug}:${checkId} -->`
const programMarker = '<!-- component-api-grade:program -->'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

export function componentSlug(component) {
  assert(
    typeof component === 'string' && /^[A-Za-z0-9][A-Za-z0-9 .-]{0,79}$/.test(component.trim()),
    'Component name must contain only letters, numbers, spaces, periods, and hyphens',
  )
  const normalized = component.trim().replace(/\s+/g, ' ')
  const slug =
    normalized
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'component'
  const hash = createHash('sha256').update(normalized).digest('hex').slice(0, 8)
  return `${slug}-${hash}`
}

function markdownText(value) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, ' ')
    .replace(/\r\n?/g, '\n')
    .replace(/\n+/g, ' ')
    .replace(/@/g, '@\u200b')
    .replace(/</g, '&lt;')
    .replace(/([\\`*_{}\[\]()#+.!|>])/g, '\\$1')
    .trim()
}

function scoreText(grade) {
  if (!grade.scoreRange) return 'UNKNOWN'
  const {min, max} = grade.scoreRange
  if (min === max) return `${min.toFixed(2)}/100 (${grade.grade ?? grade.gradeRange.min})`
  return `${min.toFixed(2)}-${max.toFixed(2)}/100 (${grade.gradeRange.min}-${grade.gradeRange.max})`
}

function sectionScoreText(section) {
  if (!section.scoreRange) return 'N/A'
  const {min, max} = section.scoreRange
  return min === max ? `${min.toFixed(2)}/5` : `${min.toFixed(2)}-${max.toFixed(2)}/5`
}

function validateMarkdown(audit, grade, scorecardMarkdown) {
  assert(typeof scorecardMarkdown === 'string' && scorecardMarkdown.trim().length > 0, 'Scorecard Markdown is required')
  assert(scorecardMarkdown.length <= maxInputLength, 'Scorecard Markdown must be at most 30,000 characters')
  const heading = scorecardMarkdown.trimStart().split(/\r?\n/, 1)[0]
  assert(/^#\s+.*component API scorecard$/i.test(heading), 'Scorecard must use the component API scorecard heading')
  assert(
    scorecardMarkdown.includes(`**Component:** ${audit.component}`),
    'Scorecard component must match the audit JSON',
  )
  assert(
    scorecardMarkdown.toLowerCase().includes(audit.sourceSha.toLowerCase()),
    'Scorecard must include the audited source SHA',
  )
  const activeGradeLine = scorecardMarkdown.split(/\r?\n/).find(line => line.includes('**Active grade:**'))
  assert(activeGradeLine, 'Scorecard must include its active grade')
  assert(activeGradeLine.includes(`**Status:** ${grade.status}`), 'Scorecard status must match the calculated grade')
  if (!grade.scoreRange) {
    assert(/\*\*Active grade:\*\*\s*UNKNOWN/.test(activeGradeLine), 'Scorecard grade must match the calculated grade')
    return
  }

  const scoreMatch = activeGradeLine.match(/\*\*Active grade:\*\*\s*([\d.]+)(?:\s*[-–—]\s*([\d.]+))?\s*\/\s*100/i)
  assert(scoreMatch, 'Scorecard must report its active grade as a score out of 100')
  const scoreMin = Number(scoreMatch[1])
  const scoreMax = Number(scoreMatch[2] ?? scoreMatch[1])
  assert(
    scoreMin.toFixed(2) === grade.scoreRange.min.toFixed(2) && scoreMax.toFixed(2) === grade.scoreRange.max.toFixed(2),
    'Scorecard grade must match the calculated grade',
  )
  const expectedGradeLabels = grade.grade ? [grade.grade] : [grade.gradeRange.min, grade.gradeRange.max]
  assert(
    expectedGradeLabels.every(label => activeGradeLine.includes(label)),
    'Scorecard letter grade must match the calculated grade',
  )
}

export function validateReportInput({auditJson, scorecardMarkdown}) {
  assert(typeof auditJson === 'string' && auditJson.trim().length > 0, 'Audit JSON is required')
  assert(auditJson.length <= maxInputLength, 'Audit JSON must be at most 30,000 characters')
  assert(
    typeof scorecardMarkdown === 'string' && auditJson.length + scorecardMarkdown.length <= 60_000,
    'Combined report inputs must be at most 60,000 characters',
  )

  let auditPayload
  try {
    auditPayload = JSON.parse(auditJson)
  } catch {
    throw new Error('Audit JSON is invalid')
  }

  let audit = auditPayload
  if (Array.isArray(auditPayload?.audits)) {
    assert(auditPayload.audits.length === 1, 'Audit data must contain exactly one component audit')
    audit = auditPayload.audits[0]
    if (auditPayload.auditedSourceSha !== undefined) {
      assert(auditPayload.auditedSourceSha === audit.sourceSha, 'Audit data source SHA must match its component audit')
    }
  }

  const grade = calculateAudit(audit)
  const slug = componentSlug(audit.component)
  validateMarkdown(audit, grade, scorecardMarkdown)
  return {audit, auditPayload, grade, slug, scorecardMarkdown}
}

function addFindingItem(groups, checkId, item) {
  const group = groups.get(checkId) ?? []
  group.push(item)
  groups.set(checkId, group)
}

function getFindingGroups(audit) {
  const groups = new Map()
  const findings = new Map(
    [...audit.findings, ...audit.candidateFindings, ...(audit.contractFindings ?? [])].map(finding => [
      finding.id,
      finding,
    ]),
  )

  for (const row of audit.checks) {
    if (row.verdict === 'GAP' || row.verdict === 'COVERED') {
      addFindingItem(groups, row.id, {
        kind: 'active',
        verdict: row.verdict,
        evidence: row.evidence,
        finding: findings.get(row.findingId),
      })
    }
  }

  for (const row of audit.candidateChecks) {
    if (row.verdict === 'GAP') {
      addFindingItem(groups, row.id, {
        kind: 'candidate',
        verdict: row.verdict,
        evidence: row.evidence,
        finding: findings.get(row.findingId),
      })
    }
  }

  for (const finding of audit.contractFindings ?? []) {
    if (finding.status === 'OPEN') {
      addFindingItem(groups, finding.checkId, {kind: 'contract', verdict: 'DEFECT', finding})
    }
  }

  return groups
}

function issueByMarker(issues, marker, description) {
  const matches = issues.filter(issue => !issue.pull_request && issue.body?.includes(marker))
  assert(matches.length <= 1, `Multiple ${description} issues use the same stable marker`)
  return matches[0]
}

function markerCheckId(issue, prefix) {
  const markerStart = issue.body.indexOf(prefix)
  if (markerStart < 0) return null
  const idStart = markerStart + prefix.length
  const markerEnd = issue.body.indexOf(' -->', idStart)
  return markerEnd < 0 ? null : issue.body.slice(idStart, markerEnd)
}

export function createIssueSyncPlan(audit, existingIssues) {
  calculateAudit(audit)
  const slug = componentSlug(audit.component)
  const targetRows = new Map(audit.checks.map(row => [row.id, row]))
  const candidateRows = new Map(audit.candidateChecks.map(row => [row.id, row]))
  const allRows = new Map([...targetRows, ...candidateRows])
  const groups = getFindingGroups(audit)
  const prefix = `<!-- component-api-grade:finding:${slug}:`
  const existingByCheck = new Map()

  for (const issue of existingIssues) {
    if (issue.pull_request || !issue.body?.includes(prefix)) continue
    const checkId = markerCheckId(issue, prefix)
    if (!checkId) continue
    assert(!existingByCheck.has(checkId), `Multiple finding issues use the stable marker for ${checkId}`)
    existingByCheck.set(checkId, issue)
  }

  const findingActions = []
  for (const [checkId, items] of groups) {
    findingActions.push({
      action: 'upsert',
      checkId,
      items,
      issue: existingByCheck.get(checkId),
      marker: findingMarker(slug, checkId),
    })
  }

  for (const [checkId, issue] of existingByCheck) {
    if (groups.has(checkId)) continue
    const row = allRows.get(checkId)
    const hasOpenContractFinding = (audit.contractFindings ?? []).some(
      finding => finding.checkId === checkId && finding.status === 'OPEN',
    )
    findingActions.push({
      action: row?.verdict === 'PASS' && !hasOpenContractFinding ? 'close' : 'keep',
      checkId,
      issue,
      marker: findingMarker(slug, checkId),
      row,
    })
  }

  findingActions.sort((a, b) => a.checkId.localeCompare(b.checkId))
  return {
    slug,
    grade: calculateAudit(audit),
    parent: {
      action: issueByMarker(existingIssues, programMarker, 'program'),
      marker: programMarker,
    },
    component: {
      action: issueByMarker(existingIssues, componentMarker(slug), 'component'),
      marker: componentMarker(slug),
    },
    findingActions,
  }
}

function findingIssueTitle(audit, checkId, items) {
  const label = items.some(item => item.kind === 'candidate') ? 'candidate ' : ''
  return `[Component API] ${audit.component} ${label}${checkId}`
}

function renderFindingBody({audit, grade, runUrl, checkId, items, marker}) {
  const lines = [
    marker,
    `## ${audit.component} API check ${checkId}`,
    '',
    `**Grade:** ${scoreText(grade)} · **Status:** ${grade.status} · **Source:** \`${audit.sourceSha}\``,
    `**Latest report:** [scorecard and audit artifacts](${runUrl})`,
    '',
  ]

  for (const item of items) {
    const finding = item.finding
    const heading =
      item.kind === 'candidate'
        ? 'Unweighted candidate finding'
        : item.kind === 'contract'
          ? 'Current-contract defect'
          : `Rubric check (${item.verdict})`
    lines.push(`### ${heading}`, '')
    if (finding.title) lines.push(`**Finding:** ${markdownText(finding.title)}`)
    if (finding.severity) lines.push(`**Severity:** ${markdownText(finding.severity)}`)
    if (finding.classification) lines.push(`**Classification:** ${markdownText(finding.classification)}`)
    if (finding.reachableUseCase) lines.push(`**Reachable use case:** ${markdownText(finding.reachableUseCase)}`)
    if (finding.observedGap) lines.push(`**Observed gap:** ${markdownText(finding.observedGap)}`)
    if (finding.additiveFix) lines.push(`**Compatible fix:** ${markdownText(finding.additiveFix)}`)
    if (item.evidence) lines.push(`**Check evidence:** ${markdownText(item.evidence)}`)
    if (finding.citations?.length) {
      lines.push('', '**Pinned citations:**')
      for (const citation of finding.citations) {
        lines.push(`- \`${markdownText(citation.path)}:${markdownText(citation.line)} @ ${audit.sourceSha}\``)
      }
    }
    lines.push('')
  }

  lines.push(`_Updated by the [Component API grade report workflow](${runUrl})._`)
  return lines.join('\n')
}

function parentIssueBody() {
  return [
    programMarker,
    '# Component API grade program',
    '',
    'Tracks component API grades for Primer React. Each component has one child issue; each failing check has one finding child issue under its component.',
    '',
    'Validated scorecards and structured audit JSON are uploaded as workflow artifacts. Generated grade files are not committed to the repository.',
    '',
    'Run the **Component API grade report** workflow to publish a completed grader result. The workflow accepts one component scorecard and its structured audit JSON.',
  ].join('\n')
}

function renderComponentIssueBody({audit, grade, runUrl, findingIssues}) {
  const lines = [
    componentMarker(componentSlug(audit.component)),
    `# ${audit.component} component API grade`,
    '',
    `**Latest grade:** ${scoreText(grade)} · **Status:** ${grade.status} · **Open BLOCKs:** ${grade.blockCount}`,
    `**Audited source:** \`${audit.sourceSha}\``,
    `**Latest scorecard and audit artifacts:** [workflow run](${runUrl})`,
    '',
    '## Area scores',
    '',
  ]

  for (const section of grade.sections) {
    const openFindingCount = section.findings
    lines.push(
      `- **${section.name}:** ${sectionScoreText(section)}; ${openFindingCount === 0 ? 'no open gaps' : `${openFindingCount} open finding(s)`}`,
    )
  }

  lines.push('', '## Finding issues', '')
  if (findingIssues.length === 0) {
    lines.push('No open finding issues are tracked for this grade.')
  } else {
    for (const issue of findingIssues) {
      lines.push(`- [${markdownText(issue.title)}](${issue.html_url})`)
    }
  }

  return lines.join('\n')
}

function resolutionBody({audit, grade, checkId, marker, runUrl}) {
  return [
    marker,
    `## ${audit.component} API check ${checkId}`,
    '',
    `The check passed in the latest validated grade (**${scoreText(grade)}**, \`${audit.sourceSha}\`).`,
    '',
    `[View the scorecard and audit artifacts](${runUrl}).`,
  ].join('\n')
}

async function upsertIssue(api, {issue, title, body}) {
  if (issue) return api.updateIssue(issue.number, {title, body, state: 'open'})
  return api.createIssue({title, body, labels: [managedLabel]})
}

export async function syncGradeIssues({audit, api, runUrl}) {
  const grade = calculateAudit(audit)
  await api.ensureLabel()
  const plan = createIssueSyncPlan(audit, await api.listManagedIssues())
  const parentIssue = await upsertIssue(api, {
    issue: plan.parent.action,
    title: 'Component API grade program',
    body: parentIssueBody(),
  })
  const componentIssue = await upsertIssue(api, {
    issue: plan.component.action,
    title: `[Component API] ${audit.component} — ${scoreText(grade)}`,
    body: renderComponentIssueBody({audit, grade, runUrl, findingIssues: []}),
  })

  const findingResults = []
  for (const action of plan.findingActions) {
    if (action.action === 'upsert') {
      const issue = await upsertIssue(api, {
        issue: action.issue,
        title: findingIssueTitle(audit, action.checkId, action.items),
        body: renderFindingBody({
          audit,
          grade,
          runUrl,
          checkId: action.checkId,
          items: action.items,
          marker: action.marker,
        }),
      })
      findingResults.push({...action, issue})
    } else {
      findingResults.push({...action, issue: action.issue})
    }
  }

  await api.ensureSubIssue(parentIssue.number, componentIssue.id)
  for (const result of findingResults) {
    if (result.issue) await api.ensureSubIssue(componentIssue.number, result.issue.id)
  }

  for (const result of findingResults) {
    if (result.action === 'close' && result.issue.state !== 'closed') {
      result.issue = await api.closeIssue(result.issue.number, {
        body: resolutionBody({
          audit,
          grade,
          checkId: result.checkId,
          marker: result.marker,
          runUrl,
        }),
      })
    }
  }

  const openFindingIssues = findingResults
    .filter(result => result.action !== 'close' && result.issue?.state !== 'closed')
    .map(result => result.issue)
  const finalComponentIssue = await api.updateIssue(componentIssue.number, {
    title: `[Component API] ${audit.component} — ${scoreText(grade)}`,
    body: renderComponentIssueBody({audit, grade, runUrl, findingIssues: openFindingIssues}),
    state: 'open',
  })

  return {parentIssue, componentIssue: finalComponentIssue, findingResults}
}

export function createGitHubApi({apiUrl, repository, token, fetchImpl = fetch}) {
  assert(typeof token === 'string' && token.length > 0, 'GitHub token is required')
  assert(typeof apiUrl === 'string' && /^https?:\/\/[^/]+/i.test(apiUrl), 'GITHUB_API_URL must be an HTTP(S) URL')
  assert(/^[^/]+\/[^/]+$/.test(repository), 'GITHUB_REPOSITORY must be owner/name')
  const root = `${apiUrl.replace(/\/$/, '')}/repos/${repository}`

  async function request(method, endpoint, body, {allowNotFound = false} = {}) {
    const response = await fetchImpl(`${root}${endpoint}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      ...(body === undefined ? {} : {body: JSON.stringify(body)}),
    })
    const text = await response.text()
    if (allowNotFound && response.status === 404) return null
    if (!response.ok) {
      let detail = ''
      try {
        detail = JSON.parse(text).message ?? ''
      } catch {
        detail = ''
      }
      throw new Error(`${method} ${endpoint} failed (${response.status})${detail ? `: ${detail}` : ''}`)
    }
    if (!text) return null
    return JSON.parse(text)
  }

  async function listPages(endpoint) {
    const items = []
    for (let page = 1; page <= 1000; page += 1) {
      const separator = endpoint.includes('?') ? '&' : '?'
      const pageItems = await request('GET', `${endpoint}${separator}per_page=100&page=${page}`)
      assert(Array.isArray(pageItems), `Expected a list response from ${endpoint}`)
      items.push(...pageItems)
      if (pageItems.length < 100) return items
    }
    throw new Error(`Pagination limit reached for ${endpoint}`)
  }

  return {
    async ensureLabel() {
      const labelPath = `/labels/${encodeURIComponent(managedLabel)}`
      const existing = await request('GET', labelPath, undefined, {allowNotFound: true})
      if (existing) return
      try {
        await request('POST', '/labels', {
          name: managedLabel,
          color: '1d76db',
          description: 'Managed component API grade tracking issue',
        })
      } catch (error) {
        const racedCreation = await request('GET', labelPath, undefined, {allowNotFound: true})
        if (!racedCreation) throw error
      }
    },
    async listManagedIssues() {
      const endpoint = `/issues?state=all&labels=${encodeURIComponent(managedLabel)}`
      return (await listPages(endpoint)).filter(issue => !issue.pull_request)
    },
    createIssue(issue) {
      return request('POST', '/issues', issue)
    },
    updateIssue(issueNumber, issue) {
      return request('PATCH', `/issues/${issueNumber}`, issue)
    },
    closeIssue(issueNumber, issue) {
      return request('PATCH', `/issues/${issueNumber}`, {
        ...issue,
        state: 'closed',
        state_reason: 'completed',
      })
    },
    async ensureSubIssue(parentNumber, subIssueId) {
      const existing = await listPages(`/issues/${parentNumber}/sub_issues`)
      if (existing.some(issue => issue.id === subIssueId)) return
      await request('POST', `/issues/${parentNumber}/sub_issues`, {sub_issue_id: subIssueId})
    },
  }
}

function inputFromEnvironment() {
  return validateReportInput({
    auditJson: process.env.COMPONENT_API_AUDIT_JSON,
    scorecardMarkdown: process.env.COMPONENT_API_SCORECARD_MARKDOWN,
  })
}

async function prepareReport(input) {
  const runnerTemp = process.env.RUNNER_TEMP
  assert(typeof runnerTemp === 'string' && runnerTemp.length > 0, 'RUNNER_TEMP is required')
  const outputDirectory = path.join(runnerTemp, 'component-api-grade-report')
  await mkdir(outputDirectory, {recursive: true})
  await Promise.all([
    writeFile(path.join(outputDirectory, `${input.slug}-scorecard.md`), input.scorecardMarkdown, {mode: 0o600}),
    writeFile(
      path.join(outputDirectory, `${input.slug}-audit.json`),
      `${JSON.stringify(input.auditPayload, null, 2)}\n`,
      {mode: 0o600},
    ),
    writeFile(
      path.join(outputDirectory, `${input.slug}-calculation.json`),
      `${JSON.stringify(input.grade, null, 2)}\n`,
      {
        mode: 0o600,
      },
    ),
  ])
}

async function syncReport(input) {
  const api = createGitHubApi({
    apiUrl: process.env.GITHUB_API_URL,
    repository: process.env.GITHUB_REPOSITORY,
    token: process.env.GITHUB_TOKEN,
  })
  const runUrl = `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  await syncGradeIssues({audit: input.audit, api, runUrl})
}

async function main() {
  const mode = process.argv[2]
  if (!['prepare', 'sync'].includes(mode))
    throw new Error('Usage: node script/component-api-grade-report.mjs <prepare|sync>')
  const input = inputFromEnvironment()
  if (mode === 'prepare') {
    await prepareReport(input)
    console.log(`Validated scorecard for ${input.audit.component} and prepared workflow artifacts`)
  } else {
    await syncReport(input)
    console.log(`Synchronized issue hierarchy for ${input.audit.component}`)
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    await main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
