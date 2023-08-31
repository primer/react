import {Box, Octicon, Link, Text} from '@primer/react'
import {H3} from '@primer/gatsby-theme-doctocat/src/components/heading'
import {CheckCircleFillIcon, CircleIcon, SkipIcon} from '@primer/octicons-react'
import React from 'react'

/** Render component status checklist in documentation pages */
export function ComponentChecklist({items}) {
  return (
    <>
      <H3>Alpha</H3>
      <Checklist aria-describedby="alpha">
        <Checklist.Item checked={items.propsDocumented}>
          Component props and basic example usage of the component are documented on{' '}
          <Link href="https://primer.style/react/">primer.style/react</Link>.
        </Checklist.Item>
        <Checklist.Item checked={items.noUnnecessaryDeps}>
          Component does not have any unnecessary third-party dependencies.
        </Checklist.Item>
        <Checklist.Item checked={items.adaptsToThemes}>Component can adapt to different themes.</Checklist.Item>
        <Checklist.Item checked={items.adaptsToScreenSizes}>
          Component can adapt to different screen sizes.
        </Checklist.Item>
        <Checklist.Item checked={items.fullTestCoverage}>
          Component has robust unit test coverage (100% where achievable).
        </Checklist.Item>
        <Checklist.Item checked={items.visualRegressionCoverage}>
          Component has visual regression coverage of its default and interactive states.
        </Checklist.Item>
        <Checklist.Item checked={items.noAxeViolations}>
          Component does not introduce any axe violations.
        </Checklist.Item>
        <Checklist.Item checked={items.a11yReviewed}>
          Component has been manually reviewed by the accessibility team and any resulting issues have been addressed.
        </Checklist.Item>
      </Checklist>
      <H3>Beta</H3>
      <Checklist aria-describedby="beta">
        <Checklist.Item checked={items.usedInProduction}>Component is used in a production application.</Checklist.Item>
        <Checklist.Item checked={items.usageExamplesDocumented}>
          Common usage examples are documented on <Link href="https://primer.style/react/">primer.style/react</Link>.
        </Checklist.Item>
        <Checklist.Item checked={items.hasStorybookStories}>
          Common usage examples are documented in <Link href="https://primer.style/react/storybook">storybook</Link>{' '}
          stories.
        </Checklist.Item>
        <Checklist.Item checked={items.designReviewed}>
          Component has been reviewed by a systems designer and any resulting issues have been addressed.
        </Checklist.Item>
        <Checklist.Item checked={items.noPerfRegression}>
          Component does not introduce any performance regressions.
        </Checklist.Item>
      </Checklist>
      <H3>Stable</H3>
      <Checklist aria-describedby="stable">
        <Checklist.Item checked={items.apiIsStable}>
          Component API has been stable with no breaking changes for at least one month.
        </Checklist.Item>
        <Checklist.Item checked={items.addressedApiFeedback}>
          Feedback on API usability has been sought from developers using the component and any resulting issues have
          been addressed.
        </Checklist.Item>
        <Checklist.Item checked={items.hasDesignGuidelines}>
          Component has corresponding design guidelines documented in the{' '}
          <Link href="https://primer.style/design/">interface guidelines</Link>.
        </Checklist.Item>
        <Checklist.Item checked={items.hasFigmaComponent}>
          Component has corresponding Figma component in the Primer Web library.
        </Checklist.Item>
        <Checklist.Item checked={items.hasTooling}>
          Tooling (such as linters, codemods, etc.) exists to prevent further use of alternatives.
        </Checklist.Item>
      </Checklist>
    </>
  )
}

// TODO: This component should live in Doctocat
function Checklist({'aria-describedby': ariaDescribedby, children}) {
  return (
    <Box aria-describedby={ariaDescribedby} as="ul" display="grid" gridGap={2} p={0} m={0} mb={3}>
      {children}
    </Box>
  )
}

Checklist.Item = ({checked, children}) => {
  return (
    <Box as="li" display="grid" gridTemplateColumns="auto 1fr" gridGap={2} sx={{listStyleType: 'none'}}>
      <Box height="24px" display="flex" alignItems="center">
        {checked ? (
          <Octicon aria-label="Completed" icon={CheckCircleFillIcon} sx={{color: 'success.fg'}} />
        ) : checked === null ? (
          <Octicon icon={SkipIcon} sx={{color: 'fg.subtle'}} />
        ) : (
          <Octicon aria-label="To do" icon={CircleIcon} sx={{color: 'fg.subtle'}} />
        )}
      </Box>
      <Text color={checked === null ? 'fg.subtle' : 'fg.default'}>
        {checked === null ? <Text color="fg.subtle">N/A: </Text> : null}
        {children}
      </Text>
    </Box>
  )
}
