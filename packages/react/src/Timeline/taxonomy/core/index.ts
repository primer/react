/**
 * Generic Timeline taxonomy core — product-agnostic entry point.
 *
 * Re-exports the shared types and the `data-*` serializer + factory. The
 * GitHub-specific surfaces, categories, catalogs, and actor rules live in
 * `../github` and build on this core.
 */

export * from './types'
export * from './serializer'
