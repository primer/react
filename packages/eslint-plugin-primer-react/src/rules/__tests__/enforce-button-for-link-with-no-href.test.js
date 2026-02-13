const rule = require('../enforce-button-for-link-with-no-href')
const {RuleTester} = require('eslint')

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
})

ruleTester.run('enforce-button-for-link-with-no-href', rule, {
  valid: [
    // Link with href attribute
    `import {Link} from '@primer/react';
    <Link href="https://example.com">Valid Link</Link>`,

    // Link with href and inline prop
    `import {Link} from '@primer/react';
    <Link inline href="https://example.com">Valid Inline Link</Link>`,

    // Link with href and className
    `import {Link} from '@primer/react';
    <Link className="some-class" href="https://example.com">Valid Link with Class</Link>`,

    // Link with href, inline, and className
    `import {Link} from '@primer/react';
    <Link className="some-class" inline href="https://example.com">Valid Inline Link with Class</Link>`,

    // Link with href as variable
    `import {Link} from '@primer/react';
    const url = '/about';
    <Link href={url}>About</Link>`,

    // Button component (not Link)
    `import {Button} from '@primer/react';
    <Button onClick={handleClick}>Click me</Button>`,

    // Regular HTML link (not Primer Link)
    `<a onClick={handleClick}>Click me</a>`,

    // Link from different package
    `import {Link} from 'react-router-dom';
    <Link to="/about">About</Link>`,
  ],
  invalid: [
    {
      code: `import {Link} from '@primer/react';
      <Link>Invalid Link without href</Link>`,
      errors: [
        {
          messageId: 'noLinkWithoutHref',
        },
      ],
    },
    {
      code: `import {Link} from '@primer/react';
      <Link className="some-class">Invalid Link with class but no href</Link>`,
      errors: [
        {
          messageId: 'noLinkWithoutHref',
        },
      ],
    },
    {
      code: `import {Link} from '@primer/react';
      <Link inline>Invalid inline Link without href</Link>`,
      errors: [
        {
          messageId: 'noLinkWithoutHref',
        },
      ],
    },
    {
      code: `import {Link} from '@primer/react';
      <Link onClick={handleClick}>Invalid Link with onClick but no href</Link>`,
      errors: [
        {
          messageId: 'noLinkWithoutHref',
        },
      ],
    },
  ],
})
