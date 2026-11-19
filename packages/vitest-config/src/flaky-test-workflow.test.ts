import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {compileFunction} from 'node:vm'
import {afterEach, describe, expect, it, vi} from 'vitest'

const workflow = readFileSync(new URL('../../../.github/workflows/fix-flaky-tests.md', import.meta.url), 'utf8')
const match = workflow.match(/^ {6}script: \|\n((?: {8}.*\n|\n)+)/m)
if (!match) {
  throw new Error('Missing deterministic evidence collection step')
}
const execute = compileFunction(`return (async () => {\n${match[1].replace(/^ {8}/gm, '')}\n})()`, [
  'require',
  'github',
  'context',
  'core',
])
const nativeRequire = createRequire(import.meta.url)
const run = JSON.parse(`{
  "id": 123,
  "event": "push",
  "head_branch": "main",
  "status": "completed",
  "path": ".github/workflows/ci.yml",
  "head_repository": {
    "full_name": "primer/react"
  },
  "html_url": "https://github.com/primer/react/actions/runs/123",
  "head_sha": "abc123",
  "created_at": "2026-11-16T00:00:00Z",
  "run_attempt": 1
}`)
const test = {
  project: '@primer/react',
  file: 'packages/react/src/TreeView/TreeView.test.tsx',
  name: 'supports multiple typed characters',
  retryCount: 1,
  errors: ['Expected Cantalope to have focus'],
}

async function collect(runs: Array<unknown>, tests: Array<unknown> = [test]) {
  vi.stubEnv('RUNNER_TEMP', '.test')
  const writeFile = vi.fn()
  const downloadArtifact = vi.fn().mockResolvedValue({
    data: new ArrayBuffer(0),
  })
  const fs = {
    mkdir: vi.fn(),
    mkdtemp: vi.fn().mockResolvedValue('.test/download'),
    writeFile,
    rm: vi.fn(),
    rmdir: vi.fn(),
  }
  const setOutput = vi.fn()
  await execute(
    (name: string) => {
      if (name === 'node:fs/promises') {
        return fs
      }
      if (name === 'node:child_process') {
        return {
          execFile(
            _command: string,
            _args: Array<string>,
            _options: unknown,
            callback: (error: null, output: {stdout: string}) => void,
          ) {
            callback(null, {
              stdout: JSON.stringify({
                schemaVersion: 1,
                tests,
              }),
            })
          },
        }
      }
      return nativeRequire(name)
    },
    {
      rest: {
        actions: {
          listWorkflowRuns: vi.fn().mockResolvedValue({
            data: JSON.parse(`{"workflow_runs": ${JSON.stringify(runs)}}`),
          }),
          listWorkflowRunArtifacts: vi.fn().mockResolvedValue({
            data: {
              artifacts: [
                {
                  id: 1,
                  name: 'vitest-flaky-tests-react-18',
                },
                {
                  id: 2,
                  name: 'vitest-flaky-tests-react-19',
                },
              ],
            },
          }),
          downloadArtifact,
        },
      },
    },
    {
      repo: {
        owner: 'primer',
        repo: 'react',
      },
    },
    {
      setOutput,
    },
  )
  const report = JSON.parse(writeFile.mock.calls.at(-1)?.[1])
  return {
    report,
    downloadArtifact,
    setOutput,
  }
}

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('flaky-test workflow evidence step', () => {
  it('groups both React matrix reports and retains source run evidence', async () => {
    const {report, setOutput} = await collect([run])

    expect(report.candidates).toHaveLength(1)
    expect(report.candidates[0]).toMatchObject({
      file: test.file,
      name: test.name,
      evidence: [
        {
          runUrl: run.html_url,
          headSha: run.head_sha,
          artifact: 'vitest-flaky-tests-react-18',
          retryCount: 1,
          errors: test.errors,
        },
        {
          artifact: 'vitest-flaky-tests-react-19',
        },
      ],
    })
    expect(setOutput).toHaveBeenCalledWith('count', 1)
  })

  it.each([
    {...run, event: 'pull_request'},
    {...run, event: 'merge_group'},
    {...run, event: 'workflow_dispatch'},
    {...run, status: 'in_progress'},
    {...run, path: '.github/workflows/other.yml'},
    {...run, ...JSON.parse('{"head_branch": "feature"}')},
    {...run, ...JSON.parse('{"head_repository": {"full_name": "fork/react"}}')},
  ])('does not download evidence from untrusted or unrelated runs: %j', async value => {
    const {report, downloadArtifact} = await collect([value])

    expect(report.candidates).toEqual([])
    expect(downloadArtifact).not.toHaveBeenCalled()
  })

  it('rejects the entire artifact if any finding is malformed', async () => {
    const {report} = await collect([run], [test, {...test, retryCount: 0}])

    expect(report.candidates).toEqual([])
    expect(report.unavailable).toHaveLength(2)
  })

  it('does not treat an empty report as a finding', async () => {
    const {report, setOutput} = await collect([run], [])

    expect(report.candidates).toEqual([])
    expect(report.unavailable).toEqual([])
    expect(setOutput).toHaveBeenCalledWith('count', 0)
  })
})
