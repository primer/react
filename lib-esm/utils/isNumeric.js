// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

export { isNumeric as default };
