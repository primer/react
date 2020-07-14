/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
//
// ^- these area here because Doctocat has eslint errors that are not reported
// in Doctocat but are in this project. Since the error exists in an area
// of JSX code where the disable-line comment does not work, we must disable
// it for the whole file until the problem is fixed upstream.
import {BorderBox, Flex, Link, StyledOcticon, Text} from '@primer/components'
import {ChevronDownIcon, ChevronUpIcon, XIcon} from '@primer/octicons-react'
import {Link as GatsbyLink} from 'gatsby'
import debounce from 'lodash.debounce'
import React from 'react'
import navItems from '@primer/gatsby-theme-doctocat/src/nav.yml'
import primerNavItems from '@primer/gatsby-theme-doctocat/src/primer-nav.yml'
import useSiteMetadata from '@primer/gatsby-theme-doctocat/src/use-site-metadata'
import DarkButton from '@primer/gatsby-theme-doctocat/src/components/dark-button'
import Details from '@primer/gatsby-theme-doctocat/src/components/details'
import Drawer from '@primer/gatsby-theme-doctocat/src/components/drawer'
import NavItems from '@primer/gatsby-theme-doctocat/src/components/nav-items'

export function useNavDrawerState(breakpoint) {
  // Handle string values from themes with units at the end
  if (typeof breakpoint === 'string') {
    breakpoint = parseInt(breakpoint, 10)
  }
  const [isOpen, setOpen] = React.useState(false)

  const onResize = React.useCallback(() => {
    if (window.innerWidth >= breakpoint) {
      setOpen(false)
    }
  }, [setOpen, breakpoint])

  const debouncedOnResize = React.useCallback(debounce(onResize, 250), [onResize])

  React.useEffect(() => {
    if (isOpen) {
      window.addEventListener('resize', debouncedOnResize)
      return () => {
        // cancel any debounced invocation of the resize handler
        debouncedOnResize.cancel()
        window.removeEventListener('resize', debouncedOnResize)
      }
    }
  }, [isOpen, debouncedOnResize])

  return [isOpen, setOpen]
}

function NavDrawer({isOpen, onDismiss}) {
  const siteMetadata = useSiteMetadata()
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        height="100%"
        bg="gray.9"
        style={{overflow: 'auto', WebkitOverflowScrolling: 'touch'}}
      >
        <Flex flexDirection="column" flex="1 0 auto" color="blue.2" bg="gray.9">
          <BorderBox borderWidth={0} borderRadius={0} borderBottom={1} borderColor="gray.7">
            <Flex py={3} pl={4} pr={3} alignItems="center" justifyContent="space-between">
              <Link href="https://primer.style" fontFamily="mono" color="inherit">
                Primer
              </Link>
              <DarkButton aria-label="Close" onClick={onDismiss}>
                <StyledOcticon icon={XIcon} />
              </DarkButton>
            </Flex>
          </BorderBox>
          <Flex flexDirection="column">
            <PrimerNavItems items={primerNavItems} />
          </Flex>
        </Flex>
        {navItems.length > 0 ? (
          <Flex flexDirection="column" flex="1 0 auto" color="gray.7" bg="gray.0">
            <Link as={GatsbyLink} to="/" display="inline-block" color="inherit" fontFamily="mono" mx={4} my={4}>
              {siteMetadata.title}
            </Link>
            <NavItems items={navItems} />
          </Flex>
        ) : null}
      </Flex>
    </Drawer>
  )
}

function PrimerNavItems({items}) {
  return items.map((item, index) => {
    return (
      <BorderBox
        key={item.title}
        borderWidth={0}
        borderRadius={0}
        borderTop={index !== 0 ? 1 : 0}
        borderColor="gray.7"
        p={4}
      >
        {item.children ? (
          // eslint-disable-next-line react/no-array-index-key
          <Details key={index}>
            {({open, toggle}) => (
              <>
                <summary onClick={toggle} style={{cursor: 'pointer'}}>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Text>{item.title}</Text>
                    <StyledOcticon icon={open ? ChevronUpIcon : ChevronDownIcon} />
                  </Flex>
                </summary>
                <Flex flexDirection="column" mt={2}>
                  {item.children.map(child => (
                    <Link key={child.title} href={child.url} py={1} mt={2} fontSize={1} color="inherit">
                      {child.title}
                    </Link>
                  ))}
                </Flex>
              </>
            )}
          </Details>
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <Link key={index} href={item.url} color="inherit" display="block">
            {item.title}
          </Link>
        )}
      </BorderBox>
    )
  })
}

export default NavDrawer
