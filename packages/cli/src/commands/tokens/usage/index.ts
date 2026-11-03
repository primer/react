import {defineCommand} from 'citty'

export const usage = defineCommand({
  meta: {name: 'usage', description: 'Explore reference patterns for applying design tokens'},
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
