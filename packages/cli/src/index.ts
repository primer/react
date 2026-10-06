import {runMain} from 'citty'
import {defineCommand} from 'citty'
import packageJson from '../package.json' with {type: 'json'}

const main = defineCommand({
  meta: {
    name: 'primer',
    version: packageJson.version,
    description: packageJson.description,
  },
  subCommands: {
    async component() {
      const mod = await import('./commands/component')
      return mod.component
    },
    async icon() {
      const mod = await import('./commands/icon')
      return mod.icon
    },
  },
})

await runMain(main)
