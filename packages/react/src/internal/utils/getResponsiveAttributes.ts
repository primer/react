import type {ResponsiveValue} from './responsiveTypes'

/**
 * Transform the given property and values in to corresponding data attributes
 * to be placed on a container. This function is helpful for coordinating
 * between responsive prop values and the corresponding styles in CSS.
 *
 * @param property - The name that will be given to the data attribute. For
 * example, a property of "gap" will be transformed to `data-gap`.
 *
 * If responsive values are used, then the breakpoint name will be appended to
 * the data attribute name. For example, `data-gap-narrow`.
 *
 * @param values - The value, or responsive values, that will be set as the
 * value of the data property set by `property`. These values should typically
 * be a `string` or `boolean`. For boolean values, the data attribute will be
 * set when the value is `true` and will not be set when the value is `false`.
 */
export function getResponsiveAttributes<T>(
  property: string,
  values?: T | ResponsiveValue<T>,
): Record<string, T extends boolean ? '' : T> | undefined {
  if (values === undefined || values === null) {
    return
  }

  if (typeof values == 'object') {
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => {
        return serialize(`data-${property}-${key}`, value)
      }),
    )
  }

  return Object.fromEntries([serialize(`data-${property}`, values)])
}

function serialize<T>(property: string, value: T) {
  return [property, value]
}
