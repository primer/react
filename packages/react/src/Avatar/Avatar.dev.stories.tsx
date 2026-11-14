import Avatar from './Avatar'

export default {
  title: 'Components/Avatar/Dev',
}

// Regression fixture: consumer CSS overrides must remain exact in constrained flex layouts.
export const CSSSizeOverrideRegression = () => (
  <div style={{display: 'flex', width: 8, '--avatar-size': '16px'} as React.CSSProperties}>
    <Avatar
      alt="mona"
      src="https://avatars.githubusercontent.com/u/7143434?v=4"
      style={{
        width: 'var(--avatar-size)',
        height: 'var(--avatar-size)',
      }}
    />
  </div>
)
