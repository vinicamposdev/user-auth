import {LoadUserByToken} from '../../domain/usecases'
import {AccessDeniedError} from '../../presentation/errors'
import {forbidden, ok, serverError} from '../../presentation/helpers'
import {HttpResponse, Middleware} from '../../presentation/protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadUserByToken: LoadUserByToken,
    private readonly role?: string
  ) {}

  async handle (request: AuthMiddleware.Request): Promise<HttpResponse> {
    try {
      const { accessToken } = request
      if (accessToken) {
        const user = await this.loadUserByToken.load(accessToken, this.role)
        if (user) {
          return ok({ userId: user.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
