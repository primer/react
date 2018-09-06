
# Buttons

```.jsx
<FlexContainer flexDirection="column" alignItems="start" >
  <Button> Button </Button>

  <Button size="sm"> Button small </Button>

  <Button size="large"> Button large </Button>

  <ButtonDanger> ButtonDanger </ButtonDanger>

  <ButtonPrimary> ButtonPrimary </ButtonPrimary>

  <ButtonOutline> ButtonOutline </ButtonOutline>

  <Button block> Button block </Button>

  <Button linkStyle> Button linkStyle </Button>
  <ButtonLink href="https://www.goatslive.com/">This is an {'<a>'} styled as a button</ButtonLink>

  <ExampleHeading>Octicon Buttons</ExampleHeading>

  <OcticonButton icon={Pencil} label="Edit" onClick={() => alert('edit')} mr={3} />

  <Text color="red.5"><OcticonButton icon={X} label="Close" onClick={() => alert('close')} mr={3} /></Text>

  <OcticonButton icon={Hubot} size="large" label="ROBOT" onClick={() => alert('beep boop')} />
</FlexContainer>
```

export const meta = {displayName: 'Buttons'}
