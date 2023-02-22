import {AddUser, Authentication, LoadUserByToken} from '../../domain/usecases'

import {faker} from '@faker-js/faker'

export class AddUserSpy implements AddUser {
  params: AddUser.Params
  result = true

  async add (params: AddUser.Params): Promise<AddUser.Result> {
    this.params = params
    return this.result
  }
}

export class AuthenticationSpy implements Authentication {
  params: Authentication.Params
  result = {
    accessToken: faker.datatype.uuid(),
    name: faker.name.fullName()
  }

  async auth (params: Authentication.Params): Promise<Authentication.Result> {
    this.params = params
    return this.result
  }
}

export class LoadUserByTokenSpy implements LoadUserByToken {
  accessToken: string
  role: string
  result = {
    id: faker.datatype.uuid()
  }

  async load (accessToken: string, role?: string): Promise<LoadUserByToken.Result> {
    this.accessToken = accessToken
    this.role = role
    return this.result
  }
}
