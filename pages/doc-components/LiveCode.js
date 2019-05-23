import React from 'react'
import {LiveCode as MDXLive} from 'mdx-live'
import copy from 'clipboard-copy'

import {Relative, Absolute, Button, StyledOcticon} from '../..'
import {Clippy, Check} from '@githubprimer/octicons-react'

function LiveCode({children, className: language}) {
  const [code, setCode] = React.useState(children)

  return (
    <Relative>
      {language === 'language-.jsx' ? (
        <MDXLive language={language} code={code} editorProps={{onChange: code => setCode(code)}} />
      ) : (
        <pre>{code}</pre>
      )}

      <Absolute right={8} bottom={8}>
        <CopyButton code={code} />
      </Absolute>
    </Relative>
  )
}

/* Totally magic number based on what feels-right™ */
const COPY_RESET_TIME = 1500

function CopyButton({code}) {
  const [copied, setCopied] = React.useState(false)

  function onClick() {
    copy(code)
    setCopied(true)
  }

  /* Reset copied icon after some time */
  React.useEffect(
    function() {
      setTimeout(function() {
        if (copied) setCopied(false)
      }, COPY_RESET_TIME)
    },
    [copied]
  )

  return (
    <Button onClick={onClick}>
      <StyledOcticon icon={copied ? Check : Clippy} color={copied ? 'green.5' : 'inherit'} />
    </Button>
  )
}

export default LiveCode
