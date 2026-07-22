import assert from 'node:assert/strict'
import {test} from 'node:test'
import {renderInstruction, sourceDigest, validatePolicies} from './review-guidance.mjs'

const validPublicPolicy = {
  version: 1,
  ruleSets: [
    {
      id: 'example',
      title: 'Example',
      applyTo: 'packages/react/src/**/*.tsx',
      sources: ['contributor-docs/style.md'],
      sourceDigest: sourceDigest(['contributor-docs/style.md']),
      rules: [
        {
          id: 'example.rule',
          enforcement: 'enforce',
          check: 'Check the example.',
          prefer: 'Prefer the supported example.',
          source: 'contributor-docs/style.md',
        },
      ],
    },
  ],
}

test('validates a public policy and sanitized internal import', () => {
  assert.doesNotThrow(() => validatePolicies(validPublicPolicy, {version: 1, ruleSets: []}))
})

test('rejects private source details from imported policy', () => {
  assert.throws(
    () =>
      validatePolicies(validPublicPolicy, {
        version: 1,
        ruleSets: [
          {
            id: 'private',
            title: 'Private',
            applyTo: '**/*.tsx',
            rules: [
              {
                id: 'private.rule',
                enforcement: 'enforce',
                check: 'See https://example.com for the decision.',
                prefer: 'Use the decision.',
              },
            ],
          },
        ],
      }),
    /forbidden private-source text/,
  )
})

test('renders a path-scoped instruction with a rule citation', () => {
  const output = renderInstruction(validPublicPolicy.ruleSets[0])
  assert.match(output, /applyTo: 'packages\/react\/src\/\*\*\/\*\.tsx'/)
  assert.match(output, /`example\.rule`/)
  assert.match(output, /contributor-docs\/style\.md/)
})

test('rejects undeclared fields from imported policy', () => {
  assert.throws(
    () => validatePolicies(validPublicPolicy, {version: 1, ruleSets: [], privateSource: 'hidden'}),
    /unsupported field/,
  )
})

test('rejects public policy when a mapped source changed', () => {
  const stalePolicy = structuredClone(validPublicPolicy)
  stalePolicy.ruleSets[0].sourceDigest = 'stale'
  assert.throws(() => validatePolicies(stalePolicy, {version: 1, ruleSets: []}), /Sources changed for example/)
})
