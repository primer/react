import {defineCommand} from 'citty'

export const tokens = defineCommand({
  meta: {
    name: 'tokens',
    description: 'Explore Primer design tokens and their usage guidelines',
  },
  subCommands: {
    async list() {
      const mod = await import('./list')
      return mod.list
    },
    async get() {
      const mod = await import('./get')
      return mod.get
    },
    async search() {
      const mod = await import('./search')
      return mod.search
    },
    async group() {
      const mod = await import('./group')
      return mod.group
    },
    async specs() {
      const mod = await import('./specs')
      return mod.specs
    },
    async usage() {
      const mod = await import('./usage')
      return mod.usage
    },
  },
})
