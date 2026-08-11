import fs from 'node:fs/promises'
import {glob} from 'glob'
import * as z from 'zod/mini'

const StorySchema = z.object({
  id: z.string(),
})

const PropSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  type: z.string(),
  defaultValue: z.optional(z.string()),
})

const SubcomponentSchema = z.object({
  name: z.string(),
  props: z.array(PropSchema),
})

const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['alpha', 'beta', 'draft', 'stable', 'deprecated']),
  a11yReviewed: z.union([z.string(), z.literal(false)]),
  importPath: z.string(),
  stories: z.array(StorySchema),
  props: z.array(PropSchema),
  subcomponents: z.optional(z.array(SubcomponentSchema)),
})

type Component = z.output<typeof ComponentSchema>

async function list(): Promise<Array<Component>> {
  throw new Error('unimplemented')
}

type PaginateOptions = {
  page: number
  pageSize: number
}

type Paginate<T> = {
  rows: Array<T>
  totalCount: number
}

async function paginate(options: PaginateOptions): Promise<Paginate<Component>> {
  throw new Error('unimplemented')
}

async function find(): Promise<Component | null> {
  throw new Error('unimplemented')
}

async function get(): Promise<Component> {
  throw new Error('unimplemented')
}

function parse(data: unknown): z.util.SafeParseResult<Component> {
  return ComponentSchema.safeParse(data)
}

async function discover(directory: string): Promise<Array<{filepath: string; data: unknown}>> {
  const filepaths = await glob(['**/*.docs.json'], {
    cwd: directory,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**'],
  })
  return Promise.all(
    filepaths.map(async filepath => {
      const data = await fs.readFile(filepath, 'utf-8')
      return {
        filepath,
        data: JSON.parse(data),
      }
    }),
  )
}

export {list, paginate, find, get, parse, discover}
export type {Component}
