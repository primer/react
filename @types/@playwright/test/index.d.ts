export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveNoViolations(): Promise<R>
    }
  }
}
