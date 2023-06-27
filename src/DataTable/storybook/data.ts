import React from 'react'
import {alphanumeric, datetime} from '../sorting'

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

type SortOptions = {
  sort: 'name' | 'updatedAt'
  direction: 'asc' | 'desc'
}

type PaginationOptions = {
  page: number
  perPage: number
}

type ListRepoOptions = Partial<SortOptions> & Partial<PaginationOptions>

export async function fetchRepos({sort = 'name', direction = 'asc', page, perPage = 30}: ListRepoOptions = {}): Promise<
  Array<Repo>
> {
  await sleep(random(2500, 3500))

  const collection = repos.slice().sort((a, b) => {
    if (sort === 'name') {
      if (direction === 'asc') {
        return alphanumeric(a.name, b.name)
      }
      return alphanumeric(b.name, a.name)
    }

    // sort === 'updatedAt'
    if (direction === 'asc') {
      return datetime(a.updatedAt, b.updatedAt)
    }
    return datetime(b.updatedAt, a.updatedAt)
  })

  if (page !== undefined) {
    const offset = page * perPage
    return collection.slice(offset, offset + perPage)
  }

  return collection
}

export async function fetchRepoPageInfo(perPage: number): Promise<{totalCount: number; totalPages: number}> {
  await sleep(random(1000, 2000))
  return {
    totalCount: repos.length,
    totalPages: Math.ceil(repos.length / perPage),
  }
}

type Result<T> = {
  loading: boolean
  error: Error | null
  data: T | null
}

export function useQuery<T>(
  queryKey: string | Array<string | number>,
  queryFn: ({signal}: {signal: AbortSignal}) => Promise<T>,
): Result<T> {
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const [data, setData] = React.useState<T | null>(null)
  const savedQueryFn = React.useRef(queryFn)
  const key = Array.isArray(queryKey) ? queryKey.join('.') : queryKey

  React.useEffect(() => {
    savedQueryFn.current = queryFn
  })

  React.useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError(null)
    setData(null)

    savedQueryFn
      .current({signal: controller.signal})
      // eslint-disable-next-line github/no-then
      .then(data => {
        if (!controller.signal.aborted) {
          setLoading(false)
          setData(data)
          setError(null)
        }
      })
      // eslint-disable-next-line github/no-then
      .catch(error => {
        if (!controller.signal.aborted) {
          setLoading(false)
          setData(null)
          setError(error)
        }
      })
    return () => {
      controller.abort()
    }
  }, [key])

  return {
    data,
    error,
    loading,
  }
}

export function useFlakeyQuery<T>({
  queryKey,
  queryFn,
}: {
  queryKey: string | Array<string | number>
  queryFn: ({signal}: {signal: AbortSignal}) => Promise<T>
}): Result<T> {
  const {error, loading, data} = useQuery(queryKey, queryFn)
  const [previousLoading, setPreviousLoading] = React.useState(loading)
  const [previouslyHadError, setPreviouslyHadError] = React.useState(false)
  const [wrappedError, setWrappedError] = React.useState<Error | null>(null)

  if (loading !== previousLoading) {
    setPreviousLoading(loading)

    if (loading === false) {
      if (error) {
        setWrappedError(error)
      } else if (previouslyHadError) {
        setWrappedError(null)
        setPreviouslyHadError(false)
      } else {
        setWrappedError(new Error('Flakey error'))
        setPreviouslyHadError(true)
      }
    } else {
      setWrappedError(null)
    }
  }

  return {
    error: wrappedError,
    loading,
    data: wrappedError === null ? data : null,
  }
}
