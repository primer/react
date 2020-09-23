module.exports = {
  title: 'Primer Components',
  components: './playroom/components',
  outputPath: './public',
  snippets: './playroom/snippets.js',
  frameComponent: './playroom/FrameComponent.js',
  exampleCode: `
    <Box p={[3, 4]}>
      <Heading as="h1" mb={2} lineHeight="condensed">
        Primer Components Playroom
      </Heading>
      <Text as="p" mt={0} mb={3}>
        Start editing to see some magic happen! ✨
      </Text>
      <Button>Hello world</Button>
    </Box>
  `
}
