interface Repo {
  id: number
  name: string
  type: 'public' | 'internal'
  updatedAt: number
  securityFeatures: {
    dependabot: Array<string>
    codeScanning: Array<string>
  }
}

const now = Date.now()
export const repos: Array<Repo> = []

for (let i = 0; i < 1000; i++) {
  repos.push({
    id: i,
    name: `Repository ${i + 1}`,
    type: i % 3 === 0 ? 'internal' : 'public',
    updatedAt: now - 1000 * 60 * 60 * 24 * i,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  })
}

function sleep(ms = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

function random(floor: number, ceiling: number): number {
  return Math.floor(Math.random() * ceiling) + floor
}

const Repo = {
  async all() {
    await sleep(random(2500, 3500))
    return repos
  },
  async create() {
    await sleep(random(1000, 5000))
  },
  async delete() {
    await sleep(random(1000, 5000))
  },
  async paginate(offset: number, pageSize: number) {
    await sleep(random(2500, 3500))
    return repos.slice(offset * pageSize, offset * pageSize + pageSize)
  },
  async pageInfo(pageSize: number) {
    return {
      totalCount: repos.length,
      totalPages: repos.length / pageSize,
    }
  },
}

const cache = new Map()

export function fetchRepos(): Promise<Array<Repo>> {
  if (!cache.has('/repos')) {
    cache.set('/repos', Repo.all())
  }
  return cache.get('/repos')
}

export function fetchRepoPage(offset: number, pageSize: number): Promise<Array<Repo>> {
  const url = new URL('/repos', 'https://api.dev')
  url.searchParams.set('offset', `${offset}`)
  url.searchParams.set('pageSize', `${pageSize}`)
  const id = url.toString()
  if (!cache.has(id)) {
    cache.set(id, Repo.paginate(offset, pageSize))
  }
  return cache.get(id)
}

export function fetchRepoPageInfo(pageSize: number): Promise<{totalCount: number; totalPages: number}> {
  const url = new URL('/repos/page-info', 'https://api.dev')
  url.searchParams.set('pageSize', `${pageSize}`)
  const id = url.toString()
  if (!cache.has(id)) {
    cache.set(id, Repo.pageInfo(pageSize))
  }
  return cache.get(id)
}
