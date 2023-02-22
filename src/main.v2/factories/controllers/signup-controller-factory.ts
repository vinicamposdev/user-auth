import {makeDbAddUser, makeDbAuthentication, makeLogControllerDecorator, makeSignUpValidation} from '../../../main.v2/factories'
import {SignUpController} from '../../../presentation/controllers'
import type {Controller} from '../../../presentation/protocols'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddUser(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
