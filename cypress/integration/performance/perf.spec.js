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

const componentList = ['composite-components-button2--default-button', 'composite-components-actionlist--actions-story']

describe('perf tests', () => {
  it('should access perf tab', () => {
    for (let i = 0; i < componentList.length; i++) {
      const component = componentList[i]
      cy.visit(`?path=/story/${component}`)
      cy.wait(4000)
      cy.get('#storybook-panel-root').then(() => {
        cy.get('#tabbutton-performance').click()
        cy.get('#storybook-addon-performance-sample-select').select('10 samples')
        cy.get('#storybook-addon-performance-start-all-button').click()
        cy.get('#storybook-addon-performance-save-button').then(saveButton => {
          cy.wait(10000)
          cy.wrap(saveButton).click()
        })
      })
    }
  })
})
