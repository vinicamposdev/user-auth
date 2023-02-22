import swaggerConfig from '../../main.v2/docs'
import { noCache } from '../../main.v2/middlewares'

import type { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerConfig))
}
