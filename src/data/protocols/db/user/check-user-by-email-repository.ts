export interface CheckUserByEmailRepository {
  checkByEmail: (email: string) => Promise<CheckUserByEmailRepository.Result>
}

export namespace CheckUserByEmailRepository {
  export type Result = boolean
}
