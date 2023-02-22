import {Express, Router} from 'express'
import {readdirSync} from 'fs'
import {join} from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api/v2', router)
  readdirSync(join(__dirname, '../routes')).map(async file => {
    if (!file.endsWith('.map')) {
      (await import(`../routes/${file}`)).default(router)
    }
  })
}
