import {AddUser, Authentication} from '../../domain/usecases'
import {RolePretty} from '../../domain/value-objects/roles'
import {EmailInUseError} from '../../presentation/errors'
import {badRequest, forbidden, ok, serverError} from '../../presentation/helpers'
import {Controller, HttpResponse, Validation} from '../../presentation/protocols'

export class SignUpController implements Controller {
  constructor (
    private readonly addUser: AddUser,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)
      if (error) {
        return badRequest(error)
      }
      const { name, email, password, role, dob } = request
      const isValid = await this.addUser.add({
        name,
        email,
        password,
        attempts: 0,
        role: role || 'Guest',
        dob
      })
      if (!isValid) {
        return forbidden(new EmailInUseError())
      }
      const authenticationModel = await this.authentication.auth({
        email,
        password
      })
      return ok(authenticationModel)
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string
    email: string
    password: string
    passwordConfirmation: string
    role: RolePretty
    dob: string
  }
}
