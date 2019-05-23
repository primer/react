import React from 'react'
import {LiveCode} from 'mdx-live'
import copy from 'clipboard-copy'

import {Relative, Absolute, Button, StyledOcticon} from '../..'
import {Clippy, Check} from '@githubprimer/octicons-react'

function LiveCodeContainer({children}) {
  const [code, setCode] = React.useState(children)

  return (
    <Relative>
      <LiveCode code={code} editorProps={{onChange: code => setCode(code)}} />
      <CopyButton code={code} />
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
    <Absolute right={4} bottom={4}>
      <Button onClick={onClick}>
        <StyledOcticon icon={copied ? Check : Clippy} color={copied ? 'green.5' : 'inherit'} />
      </Button>
    </Absolute>
  )
}

export default LiveCodeContainer
