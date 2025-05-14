import Header from '../Header'

export function shouldAcceptCallWithNoProps() {
  return <Header />
}

export function shouldNotAcceptSystemProps() {
  return (
    <>
      {/* @ts-expect-error system props should not be accepted */}
      <Header backgroundColor="saddlebrown" />
      {/* @ts-expect-error system props should not be accepted */}
      <Header.Item backgroundColor="salmon" />
      {/* @ts-expect-error system props should not be accepted */}
      <Header.Link backgroundColor="sandybrown" />
    </>
  )
}
