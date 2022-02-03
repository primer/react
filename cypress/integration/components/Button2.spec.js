/* global cy */
/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe('perf tests', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(3000)
  })

  it('should check for counter update in counter button', () => {
    cy.visit('?path=/story/composite-components-button2--watch-counter-button')
    const watchButton = cy.get('button').get(0)
    watchButton.click()
    watchButton.text().contains('Watch 1')
  })
})
