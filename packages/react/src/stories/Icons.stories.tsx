import {StarFillIcon} from '@primer/octicons-react'
import {Stack} from '../Stack'

export default {
  title: 'Octicons/Customization',
}

export const CustomClassname = () => {
  return <StarFillIcon className="testCustomClassnameColor" />
}

export const Fill = () => {
  return (
    <Stack direction="horizontal">
      <StarFillIcon fill="var(--fgColor-default)" />
      <StarFillIcon fill="var(--fgColor-muted)" />
      <StarFillIcon fill="var(--fgColor-accent)" />
      <StarFillIcon fill="var(--fgColor-danger)" />
      <StarFillIcon fill="var(--fgColor-success)" />
      <StarFillIcon fill="var(--fgColor-attention)" />
      <StarFillIcon fill="var(--fgColor-done)" />
      <StarFillIcon fill="var(--fgColor-sponsors)" />
    </Stack>
  )
}

export const Size = () => {
  return (
    <Stack direction="horizontal">
      <StarFillIcon size="small" />
      <StarFillIcon size="medium" />
      <StarFillIcon size="large" />
    </Stack>
  )
}
