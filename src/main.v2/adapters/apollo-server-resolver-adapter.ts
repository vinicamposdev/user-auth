import {Controller} from '../../presentation/protocols'

import {ApolloError, AuthenticationError, ForbiddenError, UserInputError} from 'apollo-server-express'
import {MultipleLoginError} from '../../presentation/errors'

export const adaptResolver = async (controller: Controller, args?: any, context?: any): Promise<any> => {
  const request = {
    ...(args || {}),
    userId: context?.req?.userId
  }
  const httpResponse = await controller.handle(request)
  switch (httpResponse.statusCode) {
    case 200:
    case 204: return httpResponse.body
    case 400: throw new UserInputError(httpResponse.body.message)
    case 401: throw new AuthenticationError(httpResponse.body.message)
    case 403: throw new ForbiddenError(httpResponse.body.message)
    case 409: throw new MultipleLoginError()
    default: throw new ApolloError(httpResponse.body.message)
  }
}
