const rule = require('../a11y-tooltip-interactive-trigger')
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

ruleTester.run('non-interactive-tooltip-trigger', rule, {
  valid: [
    `import {Tooltip, Button} from '@primer/react';
    <Tooltip aria-label="Filter vegetarian options" direction="e">
      <Button>🥦</Button>
    </Tooltip>`,

    `import {Tooltip, Button} from '@primer/react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <Button>Save</Button>
    </Tooltip>`,

    `import {Tooltip, IconButton} from '@primer/react';
    import {SearchIcon} from '@primer/octicons-react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <IconButton icon={SearchIcon} aria-label="Search" />
    </Tooltip>`,

    `import {Tooltip, Button} from '@primer/react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <div>
        <Button>Save</Button>
      </div>
    </Tooltip>`,

    `import {Tooltip, Button} from '@primer/react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <div>
        <a href="https://gthub.com">Save</a>
      </div>
    </Tooltip>`,

    `import {Tooltip} from '@primer/react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <a href="https://github.com">see commit message</a>
    </Tooltip>`,

    `import {Tooltip, Link} from '@primer/react';
    <Tooltip aria-label="Supplementary text" direction="e">
      <Link href="https://github.com">Link</Link>
    </Tooltip>`,
    `
    import {Tooltip, Link} from '@primer/react';
    <Tooltip aria-label={avatar.avatarName} direction="e">
      <Link href={avatar.avatarLink} underline={true}>
        User avatar
      </Link>
    </Tooltip>`,
    `
    import {Tooltip, Link} from '@primer/react';
    <Tooltip aria-label="product" direction="e">
      <Link href={productLink}>
        Product
      </Link>
    </Tooltip>
    `,
    `
    import {Tooltip, Link} from '@primer/react';
    <Tooltip aria-label="product" direction="e">
      <Link to={productLink}>
        Product
      </Link>
    </Tooltip>
    `,
    `
    import {Tooltip, Link} from '@primer/react';
    <Tooltip aria-label="product" direction="e">
      <Link to="https://github.com">
        Product
      </Link>
    </Tooltip>
    `,
  ],
  invalid: [
    {
      code: `import {Tooltip} from '@primer/react';<Tooltip type="description" text="supportive text" direction="e"><button>button1</button><button>button2</button></Tooltip>
      `,
      errors: [
        {
          messageId: 'singleChild',
        },
      ],
    },
    {
      code: `
      import {Tooltip} from '@primer/react';
      <Tooltip aria-label="Filter vegetarian options" direction="e">
        <span>non interactive element</span>
      </Tooltip>
      `,
      errors: [
        {
          messageId: 'nonInteractiveTrigger',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <h1>Save</h1>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger',
        },
      ],
    },
    {
      code: `
      import {Tooltip} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <a>see commit message</a>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveLink',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Link} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <Link>see commit message</Link>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveLink',
        },
      ],
    },
    {
      code: `
      import {Tooltip} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <input type="hidden" />
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveInput',
        },
      ],
    },
    {
      code: `
      import {Tooltip, TextInput} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <TextInput type="hidden" aria-label="Zipcode" name="zipcode" placeholder="Zipcode" autoComplete="postal-code" />
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveInput',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <Button disabled>Save</Button>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <IconButton disabled>Save</IconButton>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <input disabled>Save</input>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveInput',
        },
      ],
    },
    {
      code: `
      import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <header>
          <span>Save</span>
        </header>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveTrigger',
        },
      ],
    },
    {
      code: `import {Tooltip, Button} from '@primer/react';
      <Tooltip aria-label="Supplementary text" direction="e">
        <h1>
          <a>Save</a>
        </h1>
      </Tooltip>`,
      errors: [
        {
          messageId: 'nonInteractiveLink',
        },
      ],
    },
  ],
})
