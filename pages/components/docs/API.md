# Display APIs

## The Problem

I've run into a lot of situations where I have to wrap a component in a Box component just to get display props, and it can end up turning markup into div soup. There's always the option of doing something like `<BranchName as={box}>` but if I want to specify a specific tag beyond that, I'm out of luck. This creates issues for things like Link and Button where I want the tag to be a or button. If I do `<Button as={Box}>` the rendered tag will be a div instead of a button.

Additionally, if I want to show/hide a component at responsive breakpoints, I have to wrap the component in an additional div in order to do so.

@broccolini also pointed out that there could be some benefits of having an explicit `Hide` component.


### Option 1
Use a `<Hide>` component that has `display` set to `none` by default

Pros:
- Very explicit about what the component is doing when you're reading through code.

- Might be able to add some additional features around a11y

Cons:
- Basically just re-implements `Box`. If you checkout the component code the only thing it's doing differently than `Box` is setting the default for `display`.

- Most of the time you will have to use the same markup that you would have used if you had just used a `Box`. It isn't any faster/simpler to use `Hide` than to use `Box`.

- If you are only hiding on certain breakpoints, using `<Hide>` seems confusing. You aren't always hiding that content, only in some cases. Someone skimming the code could easily assume it's always being hidden.

- Feels a little weird to not have display props in `Box`

- What do with do with the other display values?

```.jsx
  <Sticky zIndex={999}>
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Link href='github.com' color="white" ml={5}>
          <StyledOcticon color="blue.4" icon={MarkGithub} size="medium" />
        </Link>
        <Hide display={['none', 'inline-block', 'inline-block', 'inline-block']}>
          <Link href='github.com' mr={2} ml={3}>
            <Text fontFamily="mono" fontSize={2} color="blue.4">Primer</Text>
          </Link>
          <StyledOcticon icon={ChevronRight} mx={1} color="blue.4" />
        </Hide>
        <Link href='github.com' ml={2} mr={4}>
          <Text fontFamily="mono" fontSize={2} color="blue.4">Components</Text>
        </Link>
        <Hide display={['none', 'none', 'none', 'flex']}>
          <Search next documents='sdfs' subfolder='sdfsd' />
        </Hide>
      </Flex>
      <Hide display={['none', 'none', 'none', 'flex']}>adfs</Hide>
      <Hide display={['flex', 'flex', 'flex', 'none']}>
        <Link href="#jumpnav">
          <BorderBox
            border={1}
            borderColor="gray.6"
            borderRadius={3}
            color="white"
            display="inline-block"
            px="12px"
            py="6px"
            mr={3}
          >
            <Text fontWeight="bold" color="blue.2" fontSize={1}>
              Menu
            </Text>
          </BorderBox>
        </Link>
      </Hide>
    </Flex>
  </Sticky>
```

### Option 2
Add `display` to `COMMON` group of props, so that most components have `display` built in.

Pros:
- Way less markup. Much cleaner and easier to read

- One less wrapper component to rmemeber to use

- Less divs in the DOM


Cons:
- Less explicit. I don't think this is that big of a deal though because 
`<Hide display=['none', 'none', 'flex]>{children}</Hide>` can be confusing in it's own way.

```.jsx
  <Sticky zIndex={999}>
    <Flex alignItems="center" justifyContent="space-between">
      <Flex alignItems="center">
        <Link href='github.com' color="white" ml={5}>
          <StyledOcticon color="blue.4" icon={MarkGithub} size="medium" />
        </Link>
        <Box display={['none', 'inline-block', 'inline-block', 'inline-block']}>
          <Link href='github.com' mr={2} ml={3}>
            <Text fontFamily="mono" fontSize={2} color="blue.4">Primer</Text>
          </Link>
          <StyledOcticon icon={ChevronRight} mx={1} color="blue.4" />
        </Box>
        <Link href='github.com' ml={2} mr={4}>
          <Text fontFamily="mono" fontSize={2} color="blue.4">Components</Text>
        </Link>
        <Search display={['none', 'none', 'none', 'flex']} next documents='sdfs' subfolder='sdfsd' />
      </Flex>
      <Link display={['flex', 'flex', 'flex', 'none']} href="#jumpnav">
        <BorderBox
          border={1}
          borderColor="gray.6"
          borderRadius={3}
          color="white"
          display="inline-block"
          px="12px"
          py="6px"
          mr={3}
        >
          <Text fontWeight="bold" color="blue.2" fontSize={1}>
            Menu
          </Text>
        </BorderBox>
      </Link>
    </Flex>
  </Sticky>
```


## Notes

I'm still in favor of adding `display` to the list of common props. It feels very much like a utility. There was some worry about this making the API more complex, but in my opinion, adding the `Hide` component would make the general API of components more complex than adding it as a utility prop.

I also feel that most designers and engineers understand `display` fairly well so I'm not worried too much about the risk of making it "more" available. Right now, they could abuse it by using `Box` just as much as they could abuse it with these new APIs.


export const meta = {displayName: 'API'}
