import React, {memo} from 'react'
import Flash from '../../Flash'

export const ErrorMessage = memo(({message}: {message: string}) => (
  <Flash
    aria-live="polite"
    variant="danger"
    full
    sx={{fontSize: 1, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, px: 2, py: 2}}
  >
    {message}
  </Flash>
))
