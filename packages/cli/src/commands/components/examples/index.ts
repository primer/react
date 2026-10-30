import {defineCommand} from 'citty'

export const examples = defineCommand({
  meta: {
    name: 'examples',
    description: 'Explore Primer React component usage examples',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
