import {defineCommand} from 'citty'

export const patterns = defineCommand({
  meta: {
    name: 'patterns',
    description: 'Explore generic Primer UI patterns (prefer scenarios when they fit the task)',
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
