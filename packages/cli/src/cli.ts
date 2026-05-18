import {formatComponentInfo, formatComponentList, getComponentInfo, listComponents} from './components.js'
import {formatIconInfo, formatIconList, getIconInfo, listIcons} from './icons.js'
import {formatTokenInfo, formatTokenList, getTokenInfo, listTokens} from './tokens.js'

interface GlobalOptions {
  readonly json: boolean
}

interface ParsedGlobalOptions {
  readonly args: readonly string[]
  readonly options: GlobalOptions
}

interface Command {
  readonly name: string
  readonly usage: string
  readonly description: string
  readonly run: (args: readonly string[], options: GlobalOptions) => Promise<number> | number
}

const commands: readonly Command[] = [
  {
    name: 'components list',
    usage: 'primer components list',
    description: 'List components in the Primer design system.',
    run: (_args, options) => {
      const components = listComponents()
      writeOutput(options.json ? formatJson(components) : formatComponentList(components))
      return 0
    },
  },
  {
    name: 'components get',
    usage: 'primer components get <name>',
    description: 'Get usage docs, source, and API info for a component.',
    run: async (args, options) => {
      const name = args.join(' ')
      if (!name) {
        writeError('Usage: primer components get <name>')
        return 1
      }

      const info = await getComponentInfo(name)
      if (!info) {
        writeError(`Unable to find a Primer component named "${name}".`)
        writeError('Run `primer components list` for a list of components.')
        return 1
      }

      writeOutput(options.json ? formatJson(info) : formatComponentInfo(info))
      return 0
    },
  },
  {
    name: 'tokens list',
    usage: 'primer tokens list [--group <group>]',
    description: 'List design tokens in the Primer design system.',
    run: (args, options) => {
      const tokenOptions = parseTokenListOptions(args)
      if (!tokenOptions) {
        writeError('Usage: primer tokens list [--group <group>]')
        return 1
      }

      const tokens = listTokens(tokenOptions)
      writeOutput(options.json ? formatJson(tokens) : formatTokenList(tokens))
      return 0
    },
  },
  {
    name: 'tokens get',
    usage: 'primer tokens get <name>',
    description: 'Get guidance for when to use a design token.',
    run: (args, options) => {
      const name = args.join(' ')
      if (!name) {
        writeError('Usage: primer tokens get <name>')
        return 1
      }

      const info = getTokenInfo(name)
      if (!info) {
        writeError(`Unable to find a Primer design token named "${name}".`)
        writeError('Run `primer tokens list` for a list of tokens.')
        return 1
      }

      writeOutput(options.json ? formatJson(info) : formatTokenInfo(info))
      return 0
    },
  },
  {
    name: 'icons list',
    usage: 'primer icons list',
    description: 'List icons in the @primer/octicons-react package.',
    run: (_args, options) => {
      const icons = listIcons()
      writeOutput(options.json ? formatJson(icons) : formatIconList(icons))
      return 0
    },
  },
  {
    name: 'icons get',
    usage: 'primer icons get <name>',
    description: 'Get docs and import info for an icon.',
    run: (args, options) => {
      const name = args.join(' ')
      if (!name) {
        writeError('Usage: primer icons get <name>')
        return 1
      }

      const info = getIconInfo(name)
      if (!info) {
        writeError(`Unable to find an icon named "${name}" in @primer/octicons-react.`)
        writeError('Run `primer icons list` for a list of icons.')
        return 1
      }

      writeOutput(options.json ? formatJson(info) : formatIconInfo(info))
      return 0
    },
  },
]

function parseTokenListOptions(args: readonly string[]): {group?: string} | null {
  const options: {group?: string} = {}

  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--group') {
      const group = args[index + 1]
      if (!group) {
        return null
      }

      options.group = group
      index++
      continue
    }

    return null
  }

  return options
}

function formatHelp(): string {
  const commandList = commands
    .map(command => {
      return `  ${command.usage.padEnd(32)} ${command.description}`
    })
    .join('\n')

  return `Primer CLI

Usage:
  primer --help
  primer [--json] <command>

Commands:
${commandList}
`
}

function parseGlobalOptions(args: readonly string[]): ParsedGlobalOptions {
  return args.reduce<ParsedGlobalOptions>(
    (parsed, arg) => {
      if (arg === '--json') {
        return {
          args: parsed.args,
          options: {
            ...parsed.options,
            json: true,
          },
        }
      }

      return {
        ...parsed,
        args: [...parsed.args, arg],
      }
    },
    {
      args: [],
      options: {
        json: false,
      },
    },
  )
}

function findCommand(args: readonly string[]): {command: Command; rest: readonly string[]} | null {
  for (const command of commands) {
    const parts = command.name.split(' ')
    const matches = parts.every((part, index) => {
      return args[index] === part
    })

    if (matches) {
      return {
        command,
        rest: args.slice(parts.length),
      }
    }
  }

  return null
}

async function run(args: readonly string[]): Promise<number> {
  const parsed = parseGlobalOptions(args)

  if (parsed.args.length === 0 || parsed.args.includes('--help') || parsed.args.includes('-h')) {
    writeOutput(formatHelp())
    return 0
  }

  const match = findCommand(parsed.args)
  if (!match) {
    writeError(`Unknown command: ${parsed.args.join(' ')}`)
    writeError('Run `primer --help` for a list of commands.')
    return 1
  }

  return match.command.run(match.rest, parsed.options)
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

function writeOutput(message: string): void {
  process.stdout.write(`${message}\n`)
}

function writeError(message: string): void {
  process.stderr.write(`${message}\n`)
}

export {formatHelp, run}
