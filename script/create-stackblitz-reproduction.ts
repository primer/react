import {existsSync} from 'node:fs'
import {readFile, writeFile} from 'node:fs/promises'
import {dirname, resolve} from 'node:path'
import {pathToFileURL} from 'node:url'

export const reproductionFiles = [
  'package.json',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  'src/main.tsx',
  'src/App.tsx',
]

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => {
    switch (character) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&#39;'
    }
  })
}

export async function createStackBlitzForm(directory: string) {
  const contents = await Promise.all(reproductionFiles.map(file => readFile(resolve(directory, file), 'utf8')))
  const manifest = JSON.parse(contents[0])
  const dependencies: unknown = manifest.dependencies

  if (
    typeof dependencies !== 'object' ||
    dependencies === null ||
    Array.isArray(dependencies) ||
    !Object.values(dependencies).every(version => typeof version === 'string')
  ) {
    throw new Error('package.json must contain a dependencies object with string versions')
  }

  const fields = [
    ['project[title]', 'Primer React reproduction'],
    ['project[description]', 'Minimal public reproduction of a Primer React bug'],
    ['project[template]', 'node'],
    ...reproductionFiles.map((file, index) => [`project[files][${file}]`, contents[index]]),
  ]
  const inputs = fields.map(([name, value]) => {
    // eslint-disable-next-line github/unescaped-html-literal -- Both attributes are escaped before insertion.
    return `      <input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}" />`
  })

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Open reproduction in StackBlitz</title>
  </head>
  <body>
    <h1>Open reproduction in StackBlitz</h1>
    <p>This sends only the example files to StackBlitz. Do not include private code or credentials.</p>
    <form method="post" action="https://stackblitz.com/run" target="_self">
${inputs.join('\n')}
      <button type="submit">Open in StackBlitz</button>
    </form>
  </body>
</html>
`
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [directory, output] = process.argv.slice(2)
  if (!directory || !output || process.argv.length !== 4) {
    throw new Error('Usage: node script/create-stackblitz-reproduction.ts <example-directory> <output.html>')
  }
  await writeFile(output, await createStackBlitzForm(directory))
  const contents = await Promise.all(reproductionFiles.map(file => readFile(resolve(directory, file), 'utf8')))
  const screenshotPath = resolve(dirname(output), 'screenshot.png')
  const screenshot = existsSync(screenshotPath) ? (await readFile(screenshotPath)).toString('base64') : undefined
  await writeFile(
    resolve(dirname(output), 'reproduction.json'),
    JSON.stringify({
      files: Object.fromEntries(reproductionFiles.map((file, index) => [file, contents[index]])),
      screenshot,
    }),
  )
}
