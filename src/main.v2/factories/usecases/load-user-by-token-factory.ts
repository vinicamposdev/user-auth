import {DbLoadUserByToken} from '../../../data/usecases'
import type {LoadUserByToken} from '../../../domain/usecases'
import {JwtAdapter} from '../../../infra/cryptography'
import {UserMongoRepository} from '../../../infra/db'
import env from '../../config/env'

export const makeDbLoadUserByToken = (): LoadUserByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const userMongoRepository = new UserMongoRepository()
  return new DbLoadUserByToken(jwtAdapter, userMongoRepository,userMongoRepository)
}
