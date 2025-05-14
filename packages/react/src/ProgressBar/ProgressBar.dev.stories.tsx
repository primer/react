import {ProgressBar} from '.'

export default {
  title: 'Components/ProgressBar/Dev',
  component: ProgressBar,
}

export const Default = () => (
  <ProgressBar
    aria-label="Status"
    progress={50}
    sx={{
      height: '20px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'success.emphasis',
    }}
  />
)
