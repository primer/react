---
name: create-adr-migrator
description: 'Use when planning an ADR-driven migration from adoption tooling through stacked batch implementation and cleanup.'
---

You are a facilitator helping the user create necessary migration tooling,
skills, sub-agents, etc in order to migrate this project based on a decision
from an ADR.

The journey for this migration is:

1. Create the ADR documenting a decision for the project
2. Author code that will identify files that are not migrated yet and add them
   to our `migration-status.yml` workflow
3. [Optional] Author code that will automatically transform files to the
   preferred format of the ADR decision
4. Author skills, sub-agents, etc that will help to perform the migration
   automatically using LLMs
5. Break up the work into batches and deliver them as a stack using `gh stack`
6. Once all the files are migrated, clean-up all intermediate files that are
   only for the migration
7. Mark the ADR as adopted and implemented

## Step 1. Gather requirements

Your job right now is to identify the following:

1. What is the ADR that we are creating a migration plan for?
2. How do we migrate code to this new format?
   2.1. Can we leverage tools like eslint, stylelint, jscodeshift, etc to
   programmatically migrate code to the new format?
   2.2. If not, can we create a custom skill, script or tool to perform the migration?
   2.3. How do we detect if a file has been migrated or not? Can we use the
   results of earlier tools like eslint to flag violations and report them?
3. What size batches do we want to work in? Is it per-component, a generic batch
   size of `n`, do we want to keep each Pull Request below a certain line limit,
   etc

Once you're ready, make sure that the ADR is the first entry in the stack.

## Step 2. Scaffold the migration tooling

1. Add the initial tooling for migrating code to the ADR decision (eslint,
   stylelint, codemods, skills, etc)
2. Add the reporting workflow to `migration-status.yml` to track migration
   status of files

These additions must be the next entry in the stack.

## Step 3. Iterate on the migration tooling

Before moving on to working in batches, we need to make sure that the migration
tooling is working as expected. Work with the user in a loop until they are
satisfied with the outcomes:

1. Migrate the smallest unit necessary for a migration (file, component, etc)
   using the proposed migration tooling (script, skill, sub-agent, etc)
2. Prompt the user for feedback on the migration
3. If provided, apply the feedback to the tooling and repeat the process until
   the user is satisfied with the migration results

Perform this flow for several different migration units (or until the user tells
you to stop) to try and catch as many different scenarios as possible before
fanning out the migration.

## Step 4. Create the migrator

The final step is for you to create the driver for this migration. Using the
ADR, tooling, and other artifacts generated above, create a skill and other
necessary artifacts for driving this ADR migration to completion.

This work should be done in batch sizes based on the answer above from the user.
This migrator should prefer creating sets of batches at a time instead of doing
them all at once unless the user requests this. When invoked, it should
understand the status of the migration from the workflow and current items in
the stack in order to determine the next batch to create. The method for
batching should be included in this skill.

Each batch must be an entry in the stack.

If the user has feedback for the migration tooling, update that entry in the
stack and rebase and re-apply, as necessary, to make sure all changes apply that
guidance.

The migrator should follow a step methodology for organization (e.g. each
heading is a step). The goal of the migrator is to complete the journey at the
beginning of this skill (although some steps may already be done).
