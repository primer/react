import Avatar from './Avatar'

export default {
  title: 'Components/Avatar/Dev',
}

// Regression fixture for consumer style overrides. Use the size prop for supported sizing.
export const CSSSizeOverrideRegression = () => (
  <Avatar alt="mona" src="https://avatars.githubusercontent.com/u/7143434?v=4" style={{width: 16, height: 16}} />
)
