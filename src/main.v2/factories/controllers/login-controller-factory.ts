import { makeDbAuthentication, makeLogControllerDecorator, makeLoginValidation } from '../../../main.v2/factories'
import { LoginController } from '../../../presentation/controllers'
import type { Controller } from '../../../presentation/protocols'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
