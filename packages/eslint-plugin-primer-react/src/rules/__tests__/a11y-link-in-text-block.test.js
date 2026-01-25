const rule = require('../a11y-link-in-text-block')
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

ruleTester.run('a11y-link-in-text-block', rule, {
  valid: [
    `import {Link} from '@primer/react';
    <Box>
  
    <Link href="something">
      Blah blah
    </Link>{' '}
    . 
    </Box>
  `,
    `import {Text, Link} from '@primer/react';
  <Something>
    <Link href='blah'>
      blah
    </Link>
  </Something>
  `,
    `import {Link} from '@primer/react';
    <p>bla blah <Link inline={true}>Link level 1</Link></p>;
  `,
    `import {Link} from '@primer/react';
    <p>bla blah<Link inline>Link level 1</Link></p>;
  `,
    `import {Link} from '@primer/react';
    <><span>something</span><Link inline={true}>Link level 1</Link></>;
  `,
    `import {Link} from '@primer/react';
   <Link>Link level 1</Link>;
`,
    `import {Heading, Link} from '@primer/react';
      <Heading>
        <Link>Link level 1</Link>
        hello
      </Heading>
`,
    `import {Heading, Link} from '@primer/react';
    <Heading as="h2">
      <Link href={somePath}>
        Breadcrumb
      </Link>
      Create a thing
    </Heading>
`,
    `import {Link} from '@primer/react';
    <div>
    <h2>
    <Link href={somePath}>
      Breadcrumb
    </Link>
    </h2>
    Create a thing
    </div>
`,
    `import {Link} from '@primer/react';
    <div>
    <Link href={somePath}>
      <GitHubAvatar />{owner}
    </Link>{' '}
    last edited{' '}
    </div>
`,
    `import {Link} from '@primer/react';
    <span>
    by
    <Link href="something" sx={{p: 2, fontWeight: 'bold'}}>
      Blah blah
    </Link>
    </span>
`,
    `import {Link} from '@primer/react';
    <span>
    by
    <Link href="something" sx={{fontWeight: 'bold'}}>
      Blah blah
    </Link>
    </span>
`,
    `import {Link} from '@primer/react';
  <span>
  by
  <Link href="something" sx={{fontFamily: 'mono'}}>
    Blah blah
  </Link>
  </span>
  `,
    `import {Link} from '@primer/react';
    <Box>

    <Link href="something">
      Blah blah
    </Link>{' '}
    .
    </Box>
`,
    `import {Link} from '@primer/react';
<Heading sx={{fontSize: 1, mb: 3}} as="h3">
          In addition,{' '}
          <Link href="https://github.com/pricing" target="_blank">
            GitHub Team
          </Link>{' '}
          includes:
        </Heading>
`,
    `import {Link} from '@primer/react';
      <p>bla blah
      <Link className={styles.someClass}>Link text</Link>
      </p>
    `,
    `import {Link} from '@primer/react';
    <p>bla blah
    <Link className='some-class'>Link text</Link>
    </p>
  `,
  ],
  invalid: [
    {
      code: `import {Link} from '@primer/react';
      <p>bla blah<Link>Link level 1</Link></p>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <p><Link>Link level 1</Link> something something</p>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <p>bla blah<Link inline={false}>Link level 1</Link></p>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <Box>Something something{' '}
        <Link>Link level 1</Link>
      </Box>
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <>blah blah blah{' '}
      <Link>Link level 1</Link></>;
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
    {
      code: `import {Link} from '@primer/react';
      <>blah blah blah{' '}
      <Link underline>Link level 1</Link></>;
    `,
      errors: [{messageId: 'linkInTextBlock'}],
    },
  ],
})
