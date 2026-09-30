import type {Plugin} from 'rolldown'

/**
 * Namespace barrels are separate build inputs. Keep imports of those barrels
 * external so Rolldown emits native namespaces instead of runtime getter objects.
 * Relative paths stay valid because the build preserves the source module tree.
 */
export function preserveNamespaceExports(): Plugin {
  return {
    name: 'preserve-namespace-exports',
    resolveId(source) {
      if (source.startsWith('.') && source.endsWith('.namespace')) {
        return {
          id: `${source}.js`,
          external: 'absolute',
        }
      }
      return null
    },
  }
}
