interface PaginationArgs {
  paginate?: boolean
  limit?: string
  page?: string
}

function parsePositiveInteger(value: string | undefined, name: string, fallback: number): number {
  if (value === undefined) {
    return fallback
  }

  const number = Number(value)
  if (!/^[0-9]+$/.test(value) || !Number.isSafeInteger(number) || number < 1) {
    throw new Error(`--${name} must be a positive safe integer`)
  }

  return number
}

export function paginate<T>(items: readonly T[], args: PaginationArgs) {
  const limit = parsePositiveInteger(args.limit, 'limit', 10)
  const page = parsePositiveInteger(args.page, 'page', 1)
  const enabled = args.paginate || args.limit !== undefined || args.page !== undefined
  const start = (page - 1) * limit

  return {
    results: enabled ? items.slice(start, start + limit) : items,
    pagination: enabled
      ? {
          page,
          limit,
          total: items.length,
          totalPages: Math.ceil(items.length / limit),
        }
      : undefined,
  }
}
