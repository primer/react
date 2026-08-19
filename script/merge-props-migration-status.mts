import path from 'node:path'
import {ESLint} from 'eslint'

const directory = path.resolve(import.meta.dirname, '..')
const ruleId = 'primer/prefer-merge-props'
const eslint = new ESLint({
  cwd: directory,
  overrideConfig: [
    {
      rules: {
        [ruleId]: 'error',
      },
    },
  ],
})
const results = await eslint.lintFiles(['packages/react/src/**/*.{ts,tsx}'])
const fatalMessages = results.flatMap(result => {
  return result.messages
    .filter(message => message.fatal)
    .map(message => `${result.filePath}:${message.line} ${message.message}`)
})

if (fatalMessages.length > 0) {
  throw new Error(`Unable to generate the mergeProps migration report:\n${fatalMessages.join('\n')}`)
}

const affectedResults = results.filter(result => {
  return result.messages.some(message => message.ruleId === ruleId)
})
const violationCount = affectedResults.reduce((count, result) => {
  return count + result.messages.filter(message => message.ruleId === ruleId).length
}, 0)

write(`
# mergeProps Migration

This report tracks component roots that combine authored props with unmerged spread props.

## Status

**Unmerged component root prop spreads to migrate:** ${violationCount}

**Affected files:** ${affectedResults.length} of ${results.length}
`)

write(`
## Affected Files (${affectedResults.length})

| Filepath | Locations | Violations |
| :------- | :-------- | :--------- |`)

for (const result of affectedResults) {
  const relativePath = path.relative(directory, result.filePath)
  const messages = result.messages.filter(message => message.ruleId === ruleId)
  const locations = messages.map(
    message => `[L${message.line}](https://github.com/primer/react/blob/main/${relativePath}#L${message.line})`,
  )
  const link = `[\`${relativePath}\`](https://github.com/primer/react/blob/main/${relativePath})`

  write(`| ${link} | ${locations.join(', ')} | ${messages.length} |`)
}

function write(value: string): void {
  process.stdout.write(`${value}\n`)
}
