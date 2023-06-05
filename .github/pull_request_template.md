_Authors: Please fill out this form carefully and completely._

_Reviewers: By approving this Pull Request you are approving the code change, as well as its deployment and mitigation plans._
_Please read this description carefully. If you feel there is anything unclear or missing, please ask for updates._

#### List the issues that this change affects.
<!--Every code change must address _at least 1_ issue. Fixes a bug, completes a task, every change
      should have a corresponding issue listed here. If one does not already exist, create one. -->
      
Closes # (type the GitHub issue number after #)

### What are you trying to accomplish?
<!-- Provide a description of the changes. -->

### Screenshots
<!-- Provide before/after screenshots, videos, or graphs for any visual changes; otherwise, remove this section -->

#### Risk Assessment
  <!-- Please select from one of the following and detail why this level was chosen -->

- [ ] **Low risk** the change is small, highly observable, and easily rolled back.
- [ ] **Medium risk** changes that are isolated, reduced in scope or could impact few users. The change will not impact library availability.
- [ ] **High risk** changes are those that could impact customers and SLOs, low or no test coverage, low observability, or slow to rollback.

### What approach did you choose and why?
<!-- This section is a place for you to describe your thought process in making these changes.
     List any tradeoffs you made to take on or pay down tech debt.
     Identify any work you did to mitigate risk.
     Describe any alternative approaches you considered and why you discarded them. -->

### Anything you want to highlight for special attention from reviewers?
<!-- This is your chance to identify remaining risks and confess any uncertainties you may have about the correctness of the changes.
     Highlight anything on which you would like a second (or third) opinion.
     Keep in mind how many component uses cases may be affected by your changes when assessing risk. -->

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
