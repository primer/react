# Copilot instructions

## Repository Organization

The project is the React implementation of a design system (Primer) and is authored as a monorepo where code is organized into separate npm workspaces.
The primary workspace is `packages/react` which contains the `@primer/react` package. This package distributes the React components for the design system.

The overall structure of the project is:

- `e2e`: contains the end to end tests that run Visual Regression Tests and automated accessibility tests on components
- `examples`: contains multiple example applications that use the design system
- `packages`: contain multiple npm workspaces that are used to deliver the `@primer/react` package that is defined in `packages/react`
- `script`: contains scripts that are used to build and run the project, npm workspaces may also contain their own scripts
- `contributor-docs`: contains the documentation for contributing to the project
