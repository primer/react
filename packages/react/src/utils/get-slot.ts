export function getSlot(element: unknown) {
  // @ts-ignore - TypeScript doesn't know about the __SLOT__ prop
  return element?.['__SLOT__'] ?? element?.type?.['__SLOT__']
}
