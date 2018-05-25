// "fix" elements that have the `classname` attribute set instead of `class`
export function fixClassnameAttrs(parent) {
  for (const el of parent.querySelectorAll('[classname]')) {
    el.className = el.getAttribute('classname')
  }
}
