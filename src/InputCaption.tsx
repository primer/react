import React from 'react'
import {Text} from '..'

interface Props {
  id: string
}

const InputCaption: React.FC<Props> = props => <Text color="fg.muted" fontSize={0} {...props} />

export default InputCaption
