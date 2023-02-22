import { adaptMiddleware } from '../../main.v2/adapters'
import { makeAuthMiddleware } from '../../main.v2/factories'

export const auth = adaptMiddleware(makeAuthMiddleware())
