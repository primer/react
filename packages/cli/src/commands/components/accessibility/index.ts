import {defineCommand} from 'citty'

export const accessibility = defineCommand({
  meta: {
    name: 'accessibility',
    description: 'Explore Primer React component accessibility guidelines',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
