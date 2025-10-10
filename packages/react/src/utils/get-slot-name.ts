import type {ReactNode} from 'react'
import type React from 'react'

export function getSlotName(element: React.ReactElement | ReactNode) {
  // @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
  return element['__SLOT__'] ?? element.type['__SLOT__']
}
