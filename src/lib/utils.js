
/**
 * Splice items from an Array for with the test function returns
 * truthy, modifying the original list and returning an array of
 * the spliced items.
 *
 * ```js
 * const children = React.Children.toArray(props.children)
 * const buttons = splice(children, child => child.type === Button)
 * ```
 */
const splice = (list, test) => {
  return list.reduce((acc, item, i) => {
    if (test(item)) {
      return acc.concat(list.splice(i, 1))
    }
    return acc
  }, [])
}

export {splice}
