import {defineCommand} from 'citty'

export const usage = defineCommand({
  meta: {
    name: 'usage',
    description: 'Explore Primer React component usage guidelines',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
