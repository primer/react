import {defineCommand} from 'citty'

export const guidelines = defineCommand({
  meta: {
    name: 'guidelines',
    description: 'Explore Primer design and coding guidelines',
  },
  subCommands: {
    async coding() {
      const mod = await import('./coding')
      return mod.coding
    },
    async color() {
      const mod = await import('./color')
      return mod.color
    },
    async typography() {
      const mod = await import('./typography')
      return mod.typography
    },
  },
})
