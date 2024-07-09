import fs from 'node:fs/promises'
import path from 'node:path'
import {z} from 'zod'

const COMPONENT_JSON_PATH = path.resolve(
  process.cwd(),
  '..',
  '..',
  'packages',
  'react',
  'script',
  'prop-docs',
  'components.json',
)

const ComponentData = z.object({
  schemaVersion: z.number(),
  components: z.record(
    z.string(),
    z.object({
      id: z.string(),
      docsId: z.string(),
      name: z.string(),
      status: z.string(),
      a11yReviewed: z.boolean(),
      stories: z.array(
        z.object({
          id: z.string(),
          code: z.string(),
        }),
      ),
      importPath: z.string(),
      props: z.array(
        z.object({
          name: z.string(),
          type: z.string(),
          required: z.boolean(),
          description: z.string(),
          defaultValue: z.string(),
        }),
      ),
      subcomponents: z.array(
        z.object({
          name: z.string(),
          props: z.array(
            z.object({
              name: z.string(),
              type: z.string(),
              required: z.boolean(),
              description: z.string(),
              defaultValue: z.string(),
            }),
          ),
        }),
      ),
    }),
  ),
})

type Component = z.infer<typeof ComponentData>['components'][string]

async function getComponentData(): Promise<z.infer<typeof ComponentData>> {
  const contents = await fs.readFile(COMPONENT_JSON_PATH, 'utf-8')
  return JSON.parse(contents)
}

export async function list(): Promise<Array<Component>> {
  const data = await getComponentData()
  return Object.values(data.components)
}

export async function get(id: string): Promise<Component | undefined> {
  const components = await list()
  return components.find(component => {
    return component.id === id
  })
}
