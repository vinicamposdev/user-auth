import {RolePretty} from '../../domain/value-objects/roles'

export interface AddUser {
  add: (user: AddUser.Params) => Promise<AddUser.Result>
}

export namespace AddUser {
  export type Params = {
    name: string
    email: string
    password: string
    attempts: number
    role: RolePretty
    dob: string
  }

  export type Result = boolean
}
