import {makeDbLoadUserByToken} from '../../../main.v2/factories'
import {AuthMiddleware} from '../../../presentation/middlewares'
import type {Middleware} from '../../../presentation/protocols'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(makeDbLoadUserByToken(), role)
}
