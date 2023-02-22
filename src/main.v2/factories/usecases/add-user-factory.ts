import {DbAddUser} from '../../../data/usecases'
import {AddUser} from '../../../domain/usecases'
import {BcryptAdapter} from '../../../infra/cryptography'
import {UserMongoRepository} from '../../../infra/db'

export const makeDbAddUser = (): AddUser => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const userMongoRepository = new UserMongoRepository()
  return new DbAddUser(bcryptAdapter, userMongoRepository, userMongoRepository )
}
