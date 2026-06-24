const validRepoNameRegex = /^[\w.-]+\/[\w.-]+$/
const MAX_RETRY_ATTEMPTS = 3

function readEnv() {
  return {
    GITHUB_GRAPHQL_URL: process.env.GITHUB_GRAPHQL_URL || 'https://api.github.com/graphql',
    GITHUB_SERVER_URL: (process.env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, ''),
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  }
}

function makeQuery(repos) {
  return `
      query {
        ${Object.keys(repos)
          .map((repo, index) => {
            const [owner, name] = repo.split('/')
            return `a${index}: repository(
            owner: ${JSON.stringify(owner)}
            name: ${JSON.stringify(name)}
          ) {
            ${repos[repo]
              .map(data =>
                data.kind === 'commit'
                  ? `a${data.commit}: object(expression: ${JSON.stringify(data.commit)}) {
            ... on Commit {
            commitUrl
            associatedPullRequests(first: 50) {
              nodes {
                number
                url
                mergedAt
                author {
                  login
                  url
                }
              }
            }
            author {
              user {
                login
                url
              }
            }
          }}`
                  : `pr__${data.pull}: pullRequest(number: ${data.pull}) {
                    url
                    author {
                      login
                      url
                    }
                    mergeCommit {
                      commitUrl
                      abbreviatedOid
                    }
                  }`,
              )
              .join('\n')}
          }`
          })
          .join('\n')}
        }
    `
}

function getFetchImplementation() {
  if (typeof globalThis.fetch === 'function') {
    return {
      fetch: globalThis.fetch,
      useNodeFetchOptions: false,
    }
  }

  return {
    fetch: require('node-fetch'),
    useNodeFetchOptions: true,
  }
}

function isRetryableStatus(status) {
  return status === 429 || status >= 500
}

function isRetryableError(error) {
  // Node.js v26 can surface GitHub gzip stream failures as premature close errors.
  return (
    error?.retryable === true ||
    error?.code === 'ERR_STREAM_PREMATURE_CLOSE' ||
    error?.cause?.code === 'ERR_STREAM_PREMATURE_CLOSE' ||
    /premature close|terminated|socket hang up|network timeout/i.test(error?.message || '')
  )
}

function getCommitLink(commit, url, options = {}) {
  if (typeof commit !== 'string' || commit.length === 0) {
    throw new Error('Expected a commit SHA when generating changelog links')
  }

  const label = options.alreadyAbbreviated ? commit : commit.slice(0, 7)
  return `[\`${label}\`](${url})`
}

async function fetchGitHubData(query) {
  const {GITHUB_GRAPHQL_URL, GITHUB_TOKEN} = readEnv()
  if (!GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is required to fetch changelog data from GitHub')
  }

  const {fetch, useNodeFetchOptions} = getFetchImplementation()
  const headers = {
    Authorization: 'Bearer ' + GITHUB_TOKEN,
    // Avoid node-fetch gzip handling failures in the release workflow on Node.js v26.
    'Accept-Encoding': 'identity',
    'Content-Type': 'application/json',
  }
  const body = JSON.stringify({query})
  let lastError

  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt++) {
    try {
      const requestOptions = {
        method: 'POST',
        headers,
        body,
      }

      if (useNodeFetchOptions) {
        // Complement the identity encoding request for node-fetch v2, which is used on older Node.js versions.
        requestOptions.compress = false
      }

      const response = await fetch(GITHUB_GRAPHQL_URL, requestOptions)

      if (!response.ok && isRetryableStatus(response.status)) {
        const error = new Error(`GitHub GraphQL request failed with status ${response.status}`)
        error.retryable = true
        throw error
      }

      const data = await response.json()

      if (data.errors) {
        throw new Error(`Fetched data from GitHub returned errors\n${JSON.stringify(data.errors, null, 2)}`)
      }

      if (!data.data) {
        throw new Error(`Fetched data from GitHub has missing data\n${JSON.stringify(data)}`)
      }

      return data
    } catch (error) {
      lastError = error
      if (!isRetryableError(error)) {
        break
      }
    }
  }

  throw new Error(
    `An error occurred when fetching data from GitHub after ${MAX_RETRY_ATTEMPTS} attempts\n${lastError.message}`,
  )
}

async function loadGitHubInfo(request) {
  const {GITHUB_SERVER_URL, GITHUB_TOKEN} = readEnv()

  if (!GITHUB_TOKEN) {
    throw new Error(
      `Please create a GitHub personal access token at ${GITHUB_SERVER_URL}/settings/tokens/new with \`read:user\` and \`repo:status\` permissions and add it as the GITHUB_TOKEN environment variable`,
    )
  }

  if (!request.repo) {
    throw new Error('Please pass a GitHub repository in the form of userOrOrg/repoName to getInfo')
  }

  if (!validRepoNameRegex.test(request.repo)) {
    throw new Error(
      `Please pass a valid GitHub repository in the form of userOrOrg/repoName to getInfo (it has to match the "${validRepoNameRegex.source}" pattern)`,
    )
  }

  const repos = {
    [request.repo]: [
      request.kind === 'commit' ? {kind: 'commit', commit: request.commit} : {kind: 'pull', pull: request.pull},
    ],
  }
  const data = await fetchGitHubData(makeQuery(repos))
  return data.data.a0[request.kind === 'commit' ? `a${request.commit}` : `pr__${request.pull}`]
}

async function getInfo(request) {
  if (!request.commit) {
    throw new Error('Please pass a commit SHA to getInfo')
  }

  const data = await loadGitHubInfo({
    kind: 'commit',
    repo: request.repo,
    commit: request.commit,
  })
  let user = data.author?.user || null
  const associatedPullRequest =
    data.associatedPullRequests?.nodes?.length > 0
      ? data.associatedPullRequests.nodes.sort((a, b) => {
          if (a.mergedAt === null && b.mergedAt === null) {
            return 0
          }

          if (a.mergedAt === null) {
            return 1
          }

          if (b.mergedAt === null) {
            return -1
          }

          const dateA = new Date(a.mergedAt)
          const dateB = new Date(b.mergedAt)
          return dateA - dateB
        })[0]
      : null

  if (associatedPullRequest) {
    user = associatedPullRequest.author
  }

  return {
    user: user ? user.login : null,
    pull: associatedPullRequest ? associatedPullRequest.number : null,
    links: {
      commit: getCommitLink(request.commit, data.commitUrl),
      pull: associatedPullRequest ? `[#${associatedPullRequest.number}](${associatedPullRequest.url})` : null,
      user: user ? `[@${user.login}](${user.url})` : null,
    },
  }
}

async function getInfoFromPullRequest(request) {
  if (request.pull === undefined) {
    throw new Error('Please pass a pull request number')
  }

  const {GITHUB_SERVER_URL} = readEnv()
  const data = await loadGitHubInfo({
    kind: 'pull',
    repo: request.repo,
    pull: request.pull,
  })
  const user = data?.author
  const commit = data?.mergeCommit

  return {
    user: user ? user.login : null,
    commit: commit ? commit.abbreviatedOid : null,
    links: {
      commit: commit ? getCommitLink(commit.abbreviatedOid, commit.commitUrl, {alreadyAbbreviated: true}) : null,
      pull: `[#${request.pull}](${GITHUB_SERVER_URL}/${request.repo}/pull/${request.pull})`,
      user: user ? `[@${user.login}](${user.url})` : null,
    },
  }
}

const changelogFunctions = {
  getDependencyReleaseLine: async (changesets, dependenciesUpdated, options) => {
    if (!options.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["../script/changeset-changelog.cjs", { "repo": "org/repo" }]',
      )
    }

    if (dependenciesUpdated.length === 0) {
      return ''
    }

    const changesetLink = `- Updated dependencies [${(
      await Promise.all(
        changesets.map(async changeset => {
          if (changeset.commit) {
            const {links} = await getInfo({
              repo: options.repo,
              commit: changeset.commit,
            })
            return links.commit
          }
        }),
      )
    )
      .filter(Boolean)
      .join(', ')}]:`
    const updatedDependenciesList = dependenciesUpdated.map(
      dependency => `  - ${dependency.name}@${dependency.newVersion}`,
    )
    return [changesetLink, ...updatedDependenciesList].join('\n')
  },
  getReleaseLine: async (changeset, _type, options) => {
    if (!options?.repo) {
      throw new Error(
        'Please provide a repo to this changelog generator like this:\n"changelog": ["../script/changeset-changelog.cjs", { "repo": "org/repo" }]',
      )
    }

    const {GITHUB_SERVER_URL} = readEnv()
    let prFromSummary
    let commitFromSummary
    const usersFromSummary = []
    const replacedChangelog = changeset.summary
      .replace(/^\s*(?:pr|pull|pull\s+request):\s*#?(\d+)/im, (_, pr) => {
        const num = Number(pr)
        if (!Number.isNaN(num)) {
          prFromSummary = num
        }
        return ''
      })
      .replace(/^\s*commit:\s*([^\s]+)/im, (_, commit) => {
        commitFromSummary = commit
        return ''
      })
      .replace(/^\s*(?:author|user):\s*@?([^\s]+)/gim, (_, user) => {
        usersFromSummary.push(user)
        return ''
      })
      .trim()
    const [firstLine, ...futureLines] = replacedChangelog.split('\n').map(line => line.trimEnd())
    const links = await (async () => {
      if (prFromSummary !== undefined) {
        let {links} = await getInfoFromPullRequest({
          repo: options.repo,
          pull: prFromSummary,
        })

        if (commitFromSummary) {
          links = {
            ...links,
            commit: getCommitLink(
              commitFromSummary,
              `${GITHUB_SERVER_URL}/${options.repo}/commit/${commitFromSummary}`,
            ),
          }
        }

        return links
      }

      const commitToFetchFrom = commitFromSummary || changeset.commit

      if (commitToFetchFrom) {
        const {links} = await getInfo({
          repo: options.repo,
          commit: commitToFetchFrom,
        })
        return links
      }

      return {
        commit: null,
        pull: null,
        user: null,
      }
    })()
    const users = usersFromSummary.length
      ? usersFromSummary
          .map(userFromSummary => `[@${userFromSummary}](https://github.com/${userFromSummary})`)
          .join(', ')
      : links.user
    const prefix = [
      links.pull === null ? '' : ` ${links.pull}`,
      links.commit === null ? '' : ` ${links.commit}`,
      users === null ? '' : ` Thanks ${users}!`,
    ].join('')
    return `\n\n-${prefix ? `${prefix} -` : ''} ${firstLine}\n${futureLines.map(line => `  ${line}`).join('\n')}`
  },
}

module.exports = changelogFunctions
