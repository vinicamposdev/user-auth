import { adaptMiddleware } from '../../main.v2/adapters'
import { makeAuthMiddleware } from '../../main.v2/factories'

export const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
