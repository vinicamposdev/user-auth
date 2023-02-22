import {MongoHelper} from '..'
import {AddUserRepository, CheckUserByEmailRepository, LoadUserByEmailRepository, LoadUserByTokenRepository, UpdateAccessTokenRepository, UpdateUserAttemptsRepository} from '../../../data/protocols/db'

export class UserMongoRepository implements AddUserRepository, LoadUserByEmailRepository, UpdateAccessTokenRepository, LoadUserByTokenRepository, CheckUserByEmailRepository, UpdateUserAttemptsRepository {
  async add (data: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    const userCollection = MongoHelper.getCollection('users')
    const result = await userCollection.insertOne(data)
    return result.insertedId !== null
  }

  async loadByEmail (email: string): Promise<LoadUserByEmailRepository.Result> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne({
      email
    }, {
      projection: {
        _id: 1,
        name: 1,
        password: 1,
        attempts: 1,
      }
    })
    return user && MongoHelper.map(user)
  }

  async checkByEmail (email: string): Promise<CheckUserByEmailRepository.Result> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne({
      email
    }, {
      projection: {
        _id: 1
      }
    })
    return user !== null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const userCollection = MongoHelper.getCollection('users')
    await userCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<LoadUserByTokenRepository.Result> {
    const userCollection = MongoHelper.getCollection('users')
    const user = await userCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    }, {
      projection: {
        _id: 1
      }
    })
    return user && MongoHelper.map(user)
  }

    async updateAttempts (email: string, attempts: number): Promise<void> {
      const userCollection = MongoHelper.getCollection('users')
      const a = await userCollection.updateOne({
        email
      }, {
        $set: {
          attempts
        }
      }, { upsert: true })
      console.log(a)
    }
}
