import {defineCommand} from 'citty'

export const coding = defineCommand({
  meta: {
    name: 'coding',
    description: 'Explore Primer coding guidelines',
  },
  subCommands: {
    async get() {
      const mod = await import('./get')
      return mod.get
    },
  },
})
