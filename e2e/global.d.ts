/**
 * Add TypeScript information for custom matchers registered with
 * `expect.extend`
 *
 * @see https://playwright.dev/docs/test-advanced#add-custom-matchers-using-expectextend
 */
export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveNoViolations(): Promise<R>
    }
  }
}
