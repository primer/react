import {defineCommand} from 'citty'

export const scenarios = defineCommand({
  meta: {
    name: 'scenarios',
    description: 'Explore Primer scenario patterns for specific user tasks',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
    async list() {
      const mod = await import('./list')
      return mod.list
    },
  },
})
