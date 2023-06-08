const hexRegEx = /^#?(?:(?:[\da-f]{3}){1,2}|(?:[\da-f]{4}){1,2})$/i
export type hexString = `#${string}`
export const isHex = (hex: string | hexString): hex is hexString => hexRegEx.test(hex)
