export default function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
