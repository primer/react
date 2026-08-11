import fs from 'node:fs/promises'
import path from 'node:path'
import {defineCommand} from 'citty'
import {prettifyError, treeifyError} from 'zod/mini'
import {discover, parse} from '../components'
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
        // const {json} = ctx.args
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
