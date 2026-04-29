import {formatComponentInfo, formatComponentList, getComponentInfo, listComponents} from './components.js'

interface Command {
  readonly name: string
  readonly usage: string
  readonly description: string
  readonly run: (args: readonly string[]) => Promise<number> | number
}

const commands: readonly Command[] = [
  {
    name: 'components list',
    usage: 'primer components list',
    description: 'List components in the Primer design system.',
    run: () => {
      writeOutput(formatComponentList(listComponents()))
      return 0
    },
  },
  {
    name: 'components get',
    usage: 'primer components get <name>',
    description: 'Get usage docs, source, and API info for a component.',
    run: async args => {
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

      writeOutput(formatComponentInfo(info))
      return 0
    },
  },
  {
    name: 'tokens list',
    usage: 'primer tokens list',
    description: 'List design tokens in the Primer design system.',
    run: notImplemented('tokens list'),
  },
  {
    name: 'tokens get',
    usage: 'primer tokens get <name>',
    description: 'Get guidance for when to use a design token.',
    run: notImplemented('tokens get'),
  },
]

function notImplemented(name: string): () => number {
  return () => {
    writeError(`The "${name}" command is not implemented yet.`)
    return 1
  }
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
  primer <command>

Commands:
${commandList}
`
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
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    writeOutput(formatHelp())
    return 0
  }

  const match = findCommand(args)
  if (!match) {
    writeError(`Unknown command: ${args.join(' ')}`)
    writeError('Run `primer --help` for a list of commands.')
    return 1
  }

  return match.command.run(match.rest)
}

function writeOutput(message: string): void {
  process.stdout.write(`${message}\n`)
}

function writeError(message: string): void {
  process.stderr.write(`${message}\n`)
}

export {formatHelp, run}
