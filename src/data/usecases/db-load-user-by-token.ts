import {LoadUserByToken} from '../../domain/usecases'
import {Decrypter, LoadUserByTokenRepository, UpdateUserAttemptsRepository} from '../protocols'

export class DbLoadUserByToken implements LoadUserByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadUserByTokenRepository: LoadUserByTokenRepository,
    private readonly updateUserAttemptsRepository: UpdateUserAttemptsRepository
    ) {}

  async load (accessToken: string, role?: string): Promise<LoadUserByToken.Result> {
    let token: string
    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch (error) {
      return null
    }
    if (token) {
      const user = await this.loadUserByTokenRepository.loadByToken(accessToken, role)
      if (!user) return null
      if (user.attempts < +process.env.PASSWD_MAX_ATTEMPTS) {
        await this.updateUserAttemptsRepository.updateAttempts(user.id, user.attempts + 1)
      }
      await this.updateUserAttemptsRepository.updateAttempts(user.id, 0)
      return user
    }
    return null
  }
}
