export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toHaveNoViolations(): Promise<R>
    }
  }
}
