import {BorderBox, Box, Flex, Grid, Heading, Position, Text, Details, StyledOcticon} from '@primer/components'
import {ChevronDown, ChevronRight} from '@primer/octicons-react'
import React from 'react'
import Head from '@primer/gatsby-theme-doctocat/src/components/head'
import Header, {HEADER_HEIGHT} from '@primer/gatsby-theme-doctocat/src/components/header'
import PageFooter from '@primer/gatsby-theme-doctocat/src/components/page-footer'
import Sidebar from '@primer/gatsby-theme-doctocat/src/components/sidebar'
import SourceLink from '@primer/gatsby-theme-doctocat/src/components/source-link'
import StatusLabel from '@primer/gatsby-theme-doctocat/src/components/status-label'
import TableOfContents from '@primer/gatsby-theme-doctocat/src/components/table-of-contents'

function Layout({children, pageContext}) {
  const {title, description, status, source, additionalContributors = []} = pageContext.frontmatter

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Head title={title} description={description} />
      <Header />
      <Flex flex="1 1 auto" flexDirection="row" css={{zIndex: 0}}>
        <Box display={['none', null, null, 'block']}>
          <Sidebar />
        </Box>
        <Grid
          id="skip-nav"
          maxWidth="100%"
          gridTemplateColumns={['100%', null, 'minmax(0, 65ch) 220px']}
          gridTemplateAreas={['"heading" "content"', null, '"heading ." "content table-of-contents"']}
          gridColumnGap={[null, null, 6, 7]}
          gridRowGap={3}
          mx="auto"
          p={[5, 6, null, 7]}
          css={{alignItems: 'start', alignSelf: 'start'}}
        >
          <BorderBox css={{gridArea: 'heading'}} borderWidth={0} borderBottomWidth={1} borderRadius={0} pb={2}>
            <Heading>{title}</Heading>
          </BorderBox>
          {pageContext.tableOfContents.items ? (
            <Position
              display={['none', null, 'block']}
              css={{gridArea: 'table-of-contents', overflow: 'auto'}}
              position="sticky"
              top={HEADER_HEIGHT + 24}
              maxHeight={`calc(100vh - ${HEADER_HEIGHT}px - 24px)`}
            >
              <Text display="inline-block" fontWeight="bold" mb={1}>
                Table of contents
              </Text>
              <TableOfContents items={pageContext.tableOfContents.items} />
            </Position>
          ) : null}
          <Box css={{gridArea: 'content'}}>
            {status || source ? (
              <Flex mb={3} alignItems="center">
                {status ? <StatusLabel status={status} /> : null}
                <Box mx="auto" />
                {source ? <SourceLink href={source} /> : null}
              </Flex>
            ) : null}
            {pageContext.tableOfContents.items ? (
              <Box display={['block', null, 'none']} mb={3}>
                <Details>
                  {({open}) => (
                    <>
                      <Text as="summary" fontWeight="bold">
                        <StyledOcticon icon={open ? ChevronDown : ChevronRight} mr={2} />
                        Table of contents
                      </Text>
                      <Box pt={1}>
                        <TableOfContents items={pageContext.tableOfContents.items} />
                      </Box>
                    </>
                  )}
                </Details>
              </Box>
            ) : null}
            {children}
            <PageFooter
              editUrl={pageContext.editUrl}
              contributors={pageContext.contributors.concat(additionalContributors.map(login => ({login})))}
            />
          </Box>
        </Grid>
      </Flex>
    </Flex>
  )
}

export default Layout
