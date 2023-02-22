import {DbAuthentication} from '../../../data/usecases'
import type {Authentication} from '../../../domain/usecases'
import {BcryptAdapter, JwtAdapter} from '../../../infra/cryptography'
import {UserMongoRepository} from '../../../infra/db'
import env from '../../../main.v2/config/env'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const userMongoRepository = new UserMongoRepository()
  return new DbAuthentication(userMongoRepository, bcryptAdapter, jwtAdapter, userMongoRepository,userMongoRepository)
}
