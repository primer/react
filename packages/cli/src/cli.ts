import {defineCommand, runMain} from 'citty'
import {command as componentSubCommand} from './commands/component'
import {command as tokenSubCommand} from './commands/token'
import packageJson from '../package.json' with {type: 'json'}

export function main() {
  const cli = defineCommand({
    meta: {
      name: packageJson.name,
      version: packageJson.version,
    },
    subCommands: {
      component: componentSubCommand,
      tokens: tokenSubCommand,
    },
  })

  runMain(cli)
}
