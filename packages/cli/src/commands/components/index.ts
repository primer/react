import {defineCommand} from 'citty'

export const components = defineCommand({
  meta: {
    name: 'components',
    description: 'Explore Primer React components',
  },
  subCommands: {
    async accessibility() {
      const mod = await import('./accessibility')
      return mod.accessibility
    },
    async examples() {
      const mod = await import('./examples')
      return mod.examples
    },
    async get() {
      const mod = await import('./get')
      return mod.get
    },
    async list() {
      const mod = await import('./list')
      return mod.list
    },
    async usage() {
      const mod = await import('./usage')
      return mod.usage
    },
  },
})
