import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import packageJson from '../package.json' with {type: 'json'}

export function main() {
  const cli = yargs().scriptName(packageJson.name).version(packageJson.version)
  cli.strict().parse(hideBin(process.argv))
}
