import {readFile} from 'node:fs/promises'
import {reproductionFiles} from './create-stackblitz-reproduction.ts'

export interface ReproductionPublisher {
  getIssue(): Promise<{
    state: string
    body: string | null
    labels: Array<string | {name?: string}>
    type?: string | {name?: string} | null
  }>
  getComments(): Promise<Array<{body?: string | null}>>
  createTree(files: Record<string, string>, screenshot?: string): Promise<string>
  getBranch(branch: string): Promise<{sha: string; tree: string} | undefined>
  createCommit(tree: string): Promise<string>
  createBranch(branch: string, sha: string): Promise<void>
  createComment(body: string): Promise<void>
}

export async function publishBugReproduction({
  bundle,
  body,
  repository,
  issueNumber,
  runId,
  staged,
  publisher,
}: {
  bundle: unknown
  body: string
  repository: string
  issueNumber: number
  runId: string
  staged: boolean
  publisher: ReproductionPublisher
}) {
  if (
    !/^[\w.-]+\/[\w.-]+$/.test(repository) ||
    !Number.isSafeInteger(issueNumber) ||
    issueNumber < 1 ||
    !/^\d+$/.test(runId)
  ) {
    throw new Error('Invalid trusted publication context')
  }
  if (typeof bundle !== 'object' || bundle === null || !('files' in bundle)) {
    throw new Error('Missing reproduction files')
  }
  const files = bundle.files
  if (
    typeof files !== 'object' ||
    files === null ||
    Array.isArray(files) ||
    Object.keys(files).length !== reproductionFiles.length
  ) {
    throw new Error('Reproduction must contain exactly the six starter files')
  }
  const source: Record<string, string> = {}
  for (const file of reproductionFiles) {
    const content: unknown = Reflect.get(files, file)
    if (typeof content !== 'string' || content.length === 0 || content.includes('\0')) {
      throw new Error(`Invalid reproduction file: ${file}`)
    }
    source[file] = content
  }
  if (Buffer.byteLength(JSON.stringify(source)) > 128 * 1024) {
    throw new Error('Reproduction exceeds 128 KB')
  }
  const manifest: unknown = JSON.parse(source['package.json'])
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest) || !('dependencies' in manifest)) {
    throw new Error('Invalid reproduction manifest')
  }
  const dependencies = manifest.dependencies
  const trustedManifest = JSON.parse(
    await readFile(new URL('../examples/stackblitz/package.json', import.meta.url), 'utf8'),
  )
  const manifestSettings = Object.fromEntries(
    Object.entries(manifest)
      .filter(([key]) => key !== 'dependencies')
      .sort(([a], [b]) => a.localeCompare(b)),
  )
  const trustedSettings = Object.fromEntries(
    Object.entries(trustedManifest)
      .filter(([key]) => key !== 'dependencies')
      .sort(([a], [b]) => a.localeCompare(b)),
  )
  if (
    typeof dependencies !== 'object' ||
    dependencies === null ||
    Array.isArray(dependencies) ||
    Object.keys(dependencies).sort().join(',') !== '@primer/react,react,react-dom' ||
    !Object.values(dependencies).every(
      version => typeof version === 'string' && /^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version),
    ) ||
    Reflect.get(dependencies, 'react') !== Reflect.get(dependencies, 'react-dom') ||
    JSON.stringify(manifestSettings) !== JSON.stringify(trustedSettings)
  ) {
    throw new Error('Reproduction must use pinned Primer/React versions and the trusted starter scripts')
  }
  if (typeof body !== 'string' || body.trim().length < 20 || body.length > 12000) {
    throw new Error('Invalid reproduction comment')
  }
  let screenshot: string | undefined
  if ('screenshot' in bundle && bundle.screenshot !== undefined) {
    if (typeof bundle.screenshot !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(bundle.screenshot)) {
      throw new Error('Invalid screenshot encoding')
    }
    const image = Buffer.from(bundle.screenshot, 'base64')
    if (image.length > 2 * 1024 * 1024 || !image.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
      throw new Error('Screenshot must be a PNG of at most 2 MB')
    }
    screenshot = bundle.screenshot
  }

  const marker = '<!-- primer-bug-reproduction -->'
  const issue = await publisher.getIssue()
  const comments = await publisher.getComments()
  const issueType = typeof issue.type === 'string' ? issue.type : issue.type?.name
  if (
    issue.state !== 'open' ||
    (!issue.labels.some(label => (typeof label === 'string' ? label : label.name) === 'bug') && issueType !== 'Bug') ||
    comments.some(comment => comment.body?.includes(marker))
  ) {
    return {status: 'skipped'}
  }
  const hasMedia = [issue.body, ...comments.map(comment => comment.body)].some(text =>
    /!\[[^\]]*\]\(|<(?:img|video)\b|https?:\/\/[^\s)>]*(?:user-attachments\/|assets\/|\.(?:png|jpe?g|gif|webp|mp4|webm|mov)(?:[?#\s)]|$))/i.test(
      text ?? '',
    ),
  )
  if (hasMedia) screenshot = undefined
  if (staged) return {status: 'staged'}

  const branch = `reproductions/bug-${issueNumber}-${runId}`
  const tree = await publisher.createTree(source, screenshot)
  const existing = await publisher.getBranch(branch)
  if (existing && existing.tree !== tree) {
    throw new Error('Existing reproduction branch does not match the verified code')
  }
  const sha = existing?.sha ?? (await publisher.createCommit(tree))
  if (!existing) await publisher.createBranch(branch, sha)
  const link = `https://stackblitz.com/github/${repository}/tree/${sha}?file=src%2FApp.tsx`
  const runUrl = `https://github.com/${repository}/actions/runs/${runId}`
  const image = screenshot
    ? `\n\n![Reproduced issue](https://github.com/${repository}/blob/${sha}/screenshot.png?raw=true)`
    : ''
  await publisher.createComment(
    `${marker}\n\n[Open the verified reproduction in StackBlitz](${link})\n\n${body}${image}\n\n` +
      `> Generated by [Reproduce bug](${runUrl}).\n\n<!-- gh-aw-workflow-id: reproduce-bug -->`,
  )
  return {status: 'published', link}
}
