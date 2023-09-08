### What are you trying to accomplish?
<!-- Provide the GitHub issue that this issue closes. Start typing the number or name of the issue after the # below. -->
      
Closes #

<!-- Provide an overview of the changes, including before/after screenshots, videos, or graphs when helpful -->

#### Risk Assessment
  <!-- Please select from one of the following and detail why this level was chosen. Keep in mind how many component uses cases may be affected by your changes when assessing risk. -->

- [ ] **Low risk** the change is small, highly observable, and easily rolled back.
- [ ] **Medium risk** changes that are isolated, reduced in scope or could impact few users. The change will not impact library availability.
- [ ] **High risk** changes are those that could impact customers and SLOs, low or no test coverage, low observability, or slow to rollback.

### What approach did you choose and why?
<!-- This section is a place for you to describe your thought process in making these changes.
     List any tradeoffs you made to take on or pay down tech debt.
     Identify any work you did to mitigate risk.
     Describe any alternative approaches you considered and why you discarded them. -->

### Testing & Reviewing
<!-- Describe any specific details to help reviewers test or review this Pull Request -->


### Accessibility
<!--
  You may remove this section and the "Accessibility" heading above _only_ if the changes in this pull request do not impact UI. Delete all those that don't apply.
  If there are any accessibility-related updates, please describe them here.
-->
* **Fixes axe scan violation** - This change fixes an existing [axe scan](https://thehub.github.com/epd/engineering/dev-practicals/frontend/accessibility/readiness-routine/development/#axe-scans) violation.
* **No new axe scan violation** - This change does not introduce any new [axe scan](https://thehub.github.com/epd/engineering/dev-practicals/frontend/accessibility/readiness-routine/development/#axe-scans) violations.
* **New axe violation** - This change introduces a new [axe scan](https://thehub.github.com/epd/engineering/dev-practicals/frontend/accessibility/readiness-routine/development/#axe-scans) violation. Please describe why the violation cannot be resolved below.

### Merge checklist

- [ ] Added/updated tests
- [ ] Added/updated documentation
- [ ] Added/updated previews (Storybook)
- [ ] Changes are [SSR compatible](https://github.com/primer/react/blob/main/contributor-docs/CONTRIBUTING.md#ssr-compatibility)
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge

Take a look at the [What we look for in reviews](https://github.com/primer/react/blob/main/contributor-docs/CONTRIBUTING.md#what-we-look-for-in-reviews) section of the contributing guidelines for more information on how we review PRs.
