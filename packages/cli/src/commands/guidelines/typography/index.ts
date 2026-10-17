import {defineCommand} from 'citty'

export const typography = defineCommand({
  meta: {
    name: 'typography',
    description: 'Explore Primer typography usage guidelines',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
