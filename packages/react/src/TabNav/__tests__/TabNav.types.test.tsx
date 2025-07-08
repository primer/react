import TabNav from '../TabNav'
import {Button} from '../../Button'

export function shouldAcceptCallWithNoProps() {
  return (
    <>
      <TabNav />
      <TabNav.Link />
    </>
  )
}

export function shouldAcceptButtonAsProps() {
  return <TabNav.Link as={Button} />
}

export function shouldAcceptTabNavLinkprops() {
  return <TabNav.Link to="to something" selected as={Button} />
}

export function shouldAcceptDisableProps() {
  return (
    <TabNav.Link
      disabled={true}
      onClick={() => {
        // noop
      }}
    />
  )
}
