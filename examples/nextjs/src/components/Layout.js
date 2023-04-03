import React from 'react'
import Navigation from './Navigation'
import {Box} from '@primer/react'

export default function Layout({children}) {
  return (
    // <PageLayout padding="none" containerWidth="full" rowGap="none" columnGap="none" sx={{pb: 4}}>
    //   <PageLayout.Header padding="normal">

    <>
      <Navigation />
      <main>{children}</main>
    </>

    //   </PageLayout.Header>
    //   <PageLayout.Content width="full">content</PageLayout.Content>
    // </PageLayout>
  )
}
