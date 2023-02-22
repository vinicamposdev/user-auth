export interface LoadUserByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<LoadUserByTokenRepository.Result>
}

export namespace LoadUserByTokenRepository {
  export type Result = {
    id: string
    attempts: number
  }
}
