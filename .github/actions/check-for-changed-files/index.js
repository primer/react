const fs = require('node:fs')

const apiVersion = '2022-11-28'
const userAgent = 'primer-react-check-for-changed-files'

main().catch(error => {
  fail(error.message)
})

async function main() {
  const payload = readEventPayload()
  const inputs = readInputs()

  if (!payload || !payload.pull_request || !payload.repository || process.env.GITHUB_EVENT_NAME !== 'pull_request') {
    info(`${JSON.stringify(process.env.GITHUB_EVENT_NAME)} is not a full 'pull_request' event; skipping`)
    return
  }

  const labels = payload.pull_request.labels.map(label => label.name)
  if (inputs.skipLabel && labels.includes(inputs.skipLabel)) {
    info(`the skip label ${JSON.stringify(inputs.skipLabel)} is set`)
    return
  }

  const filenames = await listChangedFiles(payload, inputs.token)
  if (!anyFileMatches(filenames, inputs.preReqPattern)) {
    info(
      `the prerequisite ${JSON.stringify(inputs.preReqPattern)} file pattern did not match any changed files of the pull request`,
    )
    return
  }

  if (anyFileMatches(filenames, inputs.filePattern)) {
    info(`the ${JSON.stringify(inputs.filePattern)} file pattern matched the changed files of the pull request`)
    return
  }

  fail(formatFailureMessage(inputs))
}

function readEventPayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  if (!eventPath) {
    return undefined
  }
  return JSON.parse(fs.readFileSync(eventPath, 'utf8'))
}

function readInputs() {
  return {
    filePattern: getInput('file-pattern'),
    preReqPattern: getInput('prereq-pattern'),
    skipLabel: getInput('skip-label'),
    failureMessage: getInput('failure-message'),
    token: getInput('token'),
  }
}

function getInput(name) {
  return process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || ''
}

async function listChangedFiles(payload, token) {
  const owner = payload.repository.owner.login
  const repo = payload.repository.name
  const pullNumber = payload.pull_request.number
  const filenames = []
  let page = 1

  while (true) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}/files`)
    url.searchParams.set('per_page', '100')
    url.searchParams.set('page', String(page))

    const response = await fetch(url, {
      headers: getRequestHeaders(token),
    })

    if (!response.ok) {
      throw new Error(
        `Unable to list pull request files: received ${response.status} response with body: ${await response.text()}`,
      )
    }

    const files = await response.json()
    filenames.push(...files.map(file => file.filename))

    if (files.length < 100) {
      break
    }
    page += 1
  }

  return filenames
}

function getRequestHeaders(token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': userAgent,
    'X-GitHub-Api-Version': apiVersion,
  }

  if (token) {
    headers.Authorization = ['Bearer', token].join(' ')
  }

  return headers
}

function anyFileMatches(filenames, patterns) {
  return patterns
    .split('\n')
    .filter(Boolean)
    .some(pattern => filenames.some(filename => matchesPattern(filename, pattern)))
}

function matchesPattern(filename, pattern) {
  return globToRegExp(pattern).test(filename)
}

function globToRegExp(pattern) {
  let source = ''

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index]
    const nextCharacter = pattern[index + 1]

    if (character === '*' && nextCharacter === '*') {
      source += '.*'
      index += 1
    } else if (character === '*') {
      source += '[^/]*'
    } else if (character === '?') {
      source += '[^/]'
    } else {
      source += escapeRegExp(character)
    }
  }

  return new RegExp(`^${source}$`)
}

function escapeRegExp(value) {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
}

function formatFailureMessage(inputs) {
  return inputs.failureMessage
    .replaceAll('${prereq-pattern}', JSON.stringify(inputs.preReqPattern))
    .replaceAll('${file-pattern}', JSON.stringify(inputs.filePattern))
    .replaceAll('${skip-label}', JSON.stringify(inputs.skipLabel))
}

function info(message) {
  process.stdout.write(`${message}\n`)
}

function fail(message) {
  process.stderr.write(`::error::${message}\n`)
  process.exitCode = 1
}
