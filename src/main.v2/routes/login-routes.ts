import { adaptRoute } from '../../main.v2/adapters'
import { makeLoginController, makeSignUpController } from '../../main.v2/factories'

import type { Router } from 'express'

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeSignUpController()))
  router.post('/login', adaptRoute(makeLoginController()))
}
