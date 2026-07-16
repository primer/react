<!-- markdownlint-disable MD024 -->

# Example spec

Example communicates a small piece of status information.

## Accessibility

The component MUST expose its status to assistive technologies.

## Features

### Default

The default feature renders the current status.

#### Markup

The component MUST render a native status element.

#### Behavior

The component updates when its content changes.

### Delayed appearance

The component can avoid displaying short-lived status changes.

#### Behavior

The component MUST remain unmounted until the configured delay elapses.

#### Accessibility

Assistive text MUST appear at the same time as the visible status.

## Glossary

Status refers to the current state of an operation.
