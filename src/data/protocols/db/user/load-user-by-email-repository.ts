import {RolePretty} from '../../domain/value-objects/roles'

export interface LoadUserByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadUserByEmailRepository.Result>
}

export namespace LoadUserByEmailRepository {
  export type Result = {
    id: string
    name: string
    password: string
    attempts: number
    role: RolePretty
    dob: string
  }
}
