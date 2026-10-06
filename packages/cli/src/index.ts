import {defineCommand, runMain} from 'citty'
import packageJson from '../package.json' with {type: 'json'}

const main = defineCommand({
  meta: {
    name: 'primer',
    version: packageJson.version,
    description: packageJson.description,
  },
  subCommands: {
    async components() {
      const mod = await import('./commands/components')
      return mod.components
    },
    async guidelines() {
      const mod = await import('./commands/guidelines')
      return mod.guidelines
    },
    async icons() {
      const mod = await import('./commands/icons')
      return mod.icons
    },
  },
})

await runMain(main)
