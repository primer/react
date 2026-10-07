import {defineCommand} from 'citty'

export const color = defineCommand({
  meta: {
    name: 'color',
    description: 'Explore Primer color usage guidelines',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
