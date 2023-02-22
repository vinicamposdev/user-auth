export class MultipleLoginError extends Error {
  constructor () {
    super('Multiple Login Error, please reset your password and try again.')
    this.name = 'MultipleLoginError'
  }
}
