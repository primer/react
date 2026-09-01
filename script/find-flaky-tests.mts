#!/usr/bin/env node

import {execFile as execFileCallback} from 'node:child_process'
import {promisify} from 'node:util'

const execFile = promisify(execFileCallback)
const defaultWorkflows = ['reports.yml', 'deploy_preview.yml', 'deploy_preview_forks.yml']
const workflowPattern = /^(aat|vrt)-reports \/ (?:aat|vrt)-runner \(\d+\)$/
const testPattern = /(?:\[[^\]]+\]\s+›\s+)?(\S+\.test\.[cm]?[jt]sx?:\d+:\d+\s+›\s+.+)$/
const escapeCharacter = String.fromCharCode(27)

interface Run {
  readonly databaseId: number
  readonly createdAt: string
  readonly url: string
}

interface FlakyOccurrence {
  readonly suite: 'aat' | 'vrt'
  readonly test: string
  readonly run: Run
}

interface Options {
  readonly days: number
  readonly repo: string
  readonly workflows: Array<string>
}

export function parseFlakyTests(log: string, run: Run): Array<FlakyOccurrence> {
  const jobs = new Map<string, Array<string>>()

  for (const line of log.split('\n')) {
    const fields = line.split('\t')
    const jobName = fields[0]

    if (!workflowPattern.test(jobName)) {
      continue
    }

    const content = cleanLogLine(fields.slice(2).join('\t'))
    const lines = jobs.get(jobName) ?? []
    lines.push(content)
    jobs.set(jobName, lines)
  }

  const occurrences: Array<FlakyOccurrence> = []

  for (const [jobName, lines] of jobs) {
    const suite = jobName.startsWith('aat-') ? 'aat' : 'vrt'
    let remaining = 0

    for (const line of lines) {
      const summary = line.match(/^\s*(\d+)\s+flaky\s*$/)

      if (summary) {
        remaining = Number(summary[1])
        continue
      }

      if (remaining === 0) {
        continue
      }

      const test = line.match(testPattern)?.[1]

      if (test) {
        occurrences.push({suite, test: test.trim(), run})
        remaining -= 1
      }
    }
  }

  return occurrences
}

export function formatReport(occurrences: Array<FlakyOccurrence>, days: number): string {
  if (occurrences.length === 0) {
    return `No flaky AAT or VRT tests found in the past ${days} days.`
  }

  const flakyTests = new Map<string, {count: number; latestRun: Run; suite: 'aat' | 'vrt'; test: string}>()

  for (const occurrence of occurrences) {
    const key = `${occurrence.suite}\0${occurrence.test}`
    const current = flakyTests.get(key)

    if (current) {
      current.count += 1
      if (occurrence.run.createdAt > current.latestRun.createdAt) {
        current.latestRun = occurrence.run
      }
    } else {
      flakyTests.set(key, {
        count: 1,
        latestRun: occurrence.run,
        suite: occurrence.suite,
        test: occurrence.test,
      })
    }
  }

  const rows = [...flakyTests.values()]
    .sort((a, b) => b.count - a.count || a.test.localeCompare(b.test))
    .map(
      ({count, latestRun, suite, test}) =>
        `| ${suite.toUpperCase()} | ${escapeMarkdown(test)} | ${count} | [run](${latestRun.url}) |`,
    )

  return [
    `# Flaky AAT and VRT tests (past ${days} days)`,
    '',
    '| Workflow | Test | Flaky runs | Latest occurrence |',
    '| :------- | :--- | ---------: | :---------------- |',
    ...rows,
  ].join('\n')
}

async function main() {
  const options = await parseOptions(process.argv.slice(2))
  const since = new Date(Date.now() - options.days * 24 * 60 * 60 * 1000).toISOString()
  const runs = (await Promise.all(options.workflows.map(workflow => listRuns(options.repo, workflow, since)))).flat()
  const uniqueRuns = [...new Map(runs.map(run => [run.databaseId, run])).values()]
  const occurrences = (
    await mapLimit(uniqueRuns, 5, async run => {
      try {
        const {stdout} = await execFile(
          'gh',
          ['run', 'view', String(run.databaseId), '--repo', options.repo, '--log'],
          {maxBuffer: 100 * 1024 * 1024},
        )
        return parseFlakyTests(stdout, run)
      } catch (error) {
        process.stderr.write(`Could not read logs for ${run.url}: ${getErrorMessage(error)}\n`)
        return []
      }
    })
  ).flat()

  process.stdout.write(`${formatReport(occurrences, options.days)}\n`)
}

async function listRuns(repo: string, workflow: string, since: string): Promise<Array<Run>> {
  const {stdout} = await execFile(
    'gh',
    [
      'run',
      'list',
      '--repo',
      repo,
      '--workflow',
      workflow,
      '--status',
      'completed',
      '--created',
      `>=${since}`,
      '--limit',
      '1000',
      '--json',
      'databaseId,createdAt,url',
    ],
    {maxBuffer: 10 * 1024 * 1024},
  )
  return JSON.parse(stdout) as Array<Run>
}

async function parseOptions(args: Array<string>): Promise<Options> {
  let days = 7
  let repo = process.env.GITHUB_REPOSITORY
  const workflows: Array<string> = []

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    const value = args[index + 1]

    if (argument === '--days' && value) {
      days = Number(value)
      index += 1
    } else if (argument === '--repo' && value) {
      repo = value
      index += 1
    } else if (argument === '--workflow' && value) {
      workflows.push(value)
      index += 1
    } else {
      throw new Error(`Unknown or incomplete argument: ${argument}`)
    }
  }

  if (!repo) {
    const {stdout} = await execFile('gh', ['repo', 'view', '--json', 'nameWithOwner', '--jq', '.nameWithOwner'])
    repo = stdout.trim()
  }

  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error(`Invalid repository: ${repo}`)
  }

  if (!Number.isInteger(days) || days < 1 || days > 365) {
    throw new Error('--days must be an integer between 1 and 365')
  }

  return {days, repo, workflows: workflows.length > 0 ? workflows : defaultWorkflows}
}

function cleanLogLine(line: string): string {
  return line
    .split(escapeCharacter)
    .map((part, index) => (index === 0 ? part : part.replace(/^\[[0-?]*[ -/]*[@-~]/, '')))
    .join('')
    .replace(/^\d{4}-\d{2}-\d{2}T\S+\s/, '')
}

function escapeMarkdown(value: string): string {
  return value.replaceAll('|', '\\|')
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function mapLimit<T, U>(values: Array<T>, limit: number, callback: (value: T) => Promise<U>): Promise<Array<U>> {
  const results = new Array<U>(values.length)
  let nextIndex = 0

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await callback(values[index])
    }
  }

  await Promise.all(Array.from({length: Math.min(limit, values.length)}, () => worker()))
  return results
}

async function run() {
  try {
    await main()
  } catch (error) {
    process.stderr.write(`${getErrorMessage(error)}\n`)
    process.exitCode = 1
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await run()
}
