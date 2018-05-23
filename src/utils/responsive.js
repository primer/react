const breakpoints = [null, 'sm', 'md', 'lg', 'xl']

function defaultValidate(value) {
  return value || value === false || value === 0
}

export default function responsive(prefix, value,
                                   validate = defaultValidate,
                                   transform = String) {
  if (Array.isArray(value)) {
    return value.map((val, i) => {
      if (!validate(val)) {
        return null
      }
      const brk = breakpoints[i]
      const suffix = transform(val)
      return brk
        ? prefix.replace('-', `-${brk}-`) + suffix
        : prefix + suffix
    })
  } else if (validate(value)) {
    // console.log(value, '=>', transform(value))
    return prefix + transform(value)
  }
}

export function any(...allowed) {
  return value => allowed.includes(value)
}

export function only(allowed) {
  return v => (v === allowed)
}
