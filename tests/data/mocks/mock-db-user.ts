import {AddUserRepository, CheckUserByEmailRepository, LoadUserByEmailRepository, LoadUserByTokenRepository, UpdateAccessTokenRepository, UpdateUserAttemptsRepository} from '../protocols'

import {faker} from '@faker-js/faker'
import {RolePretty} from '../../../src/domain/value-objects/roles'

export class AddUserRepositorySpy implements AddUserRepository {
  params: AddUserRepository.Params
  result = true

  async add (params: AddUserRepository.Params): Promise<AddUserRepository.Result> {
    this.params = params
    return this.result
  }
}

export class LoadUserByEmailRepositorySpy implements LoadUserByEmailRepository {
  email: string
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    password: faker.internet.password(),
    attempts: 1,
    dob: '1990-01-01',
    role: RolePretty.Guest
  }

  async loadByEmail (email: string): Promise<LoadUserByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class CheckUserByEmailRepositorySpy implements CheckUserByEmailRepository {
  email: string
  result = false

  async checkByEmail (email: string): Promise<CheckUserByEmailRepository.Result> {
    this.email = email
    return this.result
  }
}

export class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
  token: string
  role: string
  result = {
    id: faker.datatype.uuid(),
    attempts: 1
  }

  async loadByToken (token: string, role?: string): Promise<LoadUserByTokenRepository.Result> {
    this.token = token
    this.role = role
    return this.result
  }
}

export class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken (id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}

export class UpdateUserAttemptsRepositorySpy implements UpdateUserAttemptsRepository {
  id: string
  attepmts: number

  async updateAttempts (id: string, attepmts: number): Promise<void> {
    this.id = id
    this.attepmts = attepmts
  }
}
