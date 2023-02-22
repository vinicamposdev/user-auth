import {AddUser, Authentication} from '@/domain/usecases'

import {faker} from '@faker-js/faker'
import {RolePretty} from '../../src/domain/value-objects/roles'

export const mockAddUserParams = (): AddUser.Params => ({
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  attempts: 1,
  dob: '1990-01-01',
  role: RolePretty.Guest
})

export const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
