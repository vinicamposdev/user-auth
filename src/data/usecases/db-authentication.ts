import {Encrypter, HashComparer, LoadUserByEmailRepository, UpdateAccessTokenRepository, UpdateUserAttemptsRepository} from '../../data/protocols'
import {Authentication} from '../../domain/usecases'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadUserByEmailRepository: LoadUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    private readonly updateUserAttemptsRepository: UpdateUserAttemptsRepository
    ) {}

  async auth (authenticationParams: Authentication.Params): Promise<Authentication.Result> {
    const user = await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)
    if (user) {
      const isValid = await this.hashComparer.compare(authenticationParams.password, user.password)
      if (user.attempts >= parseInt(process.env.PASSWD_MAX_ATTEMPTS)) {
        return undefined
      }
      if (!isValid) {
        await this.updateUserAttemptsRepository.updateAttempts(authenticationParams.email, user.attempts + 1)
        await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)
        return null
      }
      await this.updateUserAttemptsRepository.updateAttempts(user.id, 0)
      await this.loadUserByEmailRepository.loadByEmail(authenticationParams.email)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id)
        await this.updateAccessTokenRepository.updateAccessToken(user.id, accessToken)
        return {
          accessToken,
          name: user.name
        }
      }
    }
    return null
  }
}
