import React from 'react'

const primerPackages = [
  'primer-box',
  'primer-breadcrumb',
  'primer-buttons',
  'primer-forms',
  'primer-layout',
  'primer-marketing',
  'primer-navigation',
  'primer-product',
  'primer-support',
  'primer-table',
  'primer-tooltips',
  'primer-truncate',
  'primer-utilities',
]

const Meta = () => (
  <React.Fragment>
    <meta name='viewport' content='width=device-width,initial-scale=1' />
    <meta name='generator' content='Compositor X0' />
    {primerPackages.map((pkg, key) => (
      <link rel='stylesheet' href={`https://unpkg.com/${pkg}/build/build.css`} key={key} />
    ))}
    <link rel='icon' href='assets/favicon.png' />
    <link rel='apple-touch-icon' href='assets/apple-touch-icon.png' />
    <meta name='og:title' content='Primer React' />
    <meta name='description' content='Primer components built with React.js.' />
  </React.Fragment>
)

export default Meta
