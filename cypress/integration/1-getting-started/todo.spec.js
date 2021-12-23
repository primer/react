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

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('localhost:6006')
    cy.wait(1000)
  })

  it('should access perf tab', () => {
    cy.get('#tabbutton-performance').click()
    cy.get('#storybook-addon-performance-start-all-button').click()
  })
})
