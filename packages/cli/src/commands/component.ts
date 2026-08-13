import fs from 'node:fs/promises'
import path from 'node:path'
import {defineCommand} from 'citty'
import {prettifyError, treeifyError} from 'zod/mini'
import {list, paginate, discover, parse} from '../components'
import {createTable} from '../table'

export const command = defineCommand({
  meta: {
    name: 'component',
  },
  args: {
    json: {
      type: 'boolean',
      description: 'Output the list in JSON format',
      default: false,
    },
  },
  subCommands: {
    list: defineCommand({
      meta: {
        name: 'list',
      },
      async run(ctx) {
        const cwd = process.cwd()
        const components = await list(cwd)

        if (ctx.args.json) {
          console.log(JSON.stringify({components}, null, 2))
        } else {
          const table = createTable({
            columns: ['ID', 'Name', 'Status', 'A11y Reviewed', 'Import Path'],
            rows: components.flatMap(component => {
              const rows = [
                [component.id, component.name, component.status, `${component.a11yReviewed}`, component.importPath],
              ]

              const subcomponents = component.subcomponents?.map(subcomponent => {
                return ['', `  ${subcomponent.name}`, '', '', '']
              })

              if (Array.isArray(subcomponents)) {
                rows.push(...subcomponents)
              }

              return rows
            }),
          })

          console.log(table.toString())
        }
      },
    }),
    paginate: defineCommand({
      meta: {
        name: 'paginate',
      },
      args: {
        page: {
          type: 'string',
          description: 'The page to retrieve',
          default: '1',
        },
        pageSize: {
          type: 'string',
          description: 'The number of components per page',
          default: '20',
        },
      },
      async run(ctx) {
        const cwd = process.cwd()
        const result = await paginate(cwd, {
          page: Number(ctx.args.page),
          pageSize: Number(ctx.args.pageSize),
        })

        if (ctx.args.json) {
          console.log(JSON.stringify(result, null, 2))
        } else {
          const table = createTable({
            columns: ['ID', 'Name', 'Status', 'A11y Reviewed', 'Import Path'],
            rows: result.rows.flatMap(component => {
              const rows = [
                [component.id, component.name, component.status, `${component.a11yReviewed}`, component.importPath],
              ]

              const subcomponents = component.subcomponents?.map(subcomponent => {
                return ['', `  ${subcomponent.name}`, '', '', '']
              })

              if (Array.isArray(subcomponents)) {
                rows.push(...subcomponents)
              }

              return rows
            }),
          })

          console.log(table.toString())
        }
      },
    }),
    validate: defineCommand({
      meta: {
        name: 'validate',
      },
      args: {
        filepath: {
          type: 'positional',
          description: 'The path to the component documentation file',
          required: false,
        },
      },
      async run(ctx) {
        if (ctx.args.filepath) {
          const contents = await fs.readFile(ctx.args.filepath, 'utf-8')
          const result = parse(JSON.parse(contents))
          if (result.success) {
            return
          }

          if (ctx.args.json) {
            const output = {
              filepath: ctx.args.filepath,
              success: result.success,
              error: treeifyError(result.error),
            }

            console.log(JSON.stringify(output, null, 2))
          } else {
            const table = createTable({
              columns: ['Filepath', 'Error'],
              rows: [[ctx.args.filepath, prettifyError(result.error)]],
            })

            console.log(table.toString())
          }

          process.exitCode = 1

          return
        }

        const cwd = process.cwd()
        const entries = await discover(cwd)
        const results = entries.map(entry => {
          return {
            filepath: entry.filepath,
            parsed: parse(entry.data),
          }
        })
        const valid = results.every(result => result.parsed.success)

        if (ctx.args.json) {
          const output = results
            .filter(result => {
              return !result.parsed.success
            })
            .map(result => {
              const entry: {filepath: string; success: boolean; error?: unknown} = {
                filepath: result.filepath,
                success: result.parsed.success,
              }

              if (!result.parsed.success) {
                entry['error'] = treeifyError(result.parsed.error)
              }

              return entry
            })

          console.log(JSON.stringify(output, null, 2))
        } else {
          const rows = results
            .filter(result => {
              return !result.parsed.success
            })
            .map(result => {
              return [
                path.relative(cwd, result.filepath),
                result.parsed.success ? '' : prettifyError(result.parsed.error),
              ]
            })

          const table = createTable({
            columns: ['Filepath', 'Error'],
            rows,
          })

          if (rows.length > 0) {
            console.log(table.toString())
          }
        }

        if (!valid) {
          process.exitCode = 1
        }
      },
    }),
  },
})
