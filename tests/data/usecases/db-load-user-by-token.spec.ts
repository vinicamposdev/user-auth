import {DecrypterSpy, LoadUserByTokenRepositorySpy, UpdateUserAttemptsRepositorySpy} from '@/tests/data/mocks'
import {throwError} from '@/tests/domain'
import {DbLoadUserByToken} from '../../../src/data/usecases'

import {faker} from '@faker-js/faker'

type SutTypes = {
  sut: DbLoadUserByToken
  decrypterSpy: DecrypterSpy
  loadUserByTokenRepositorySpy: LoadUserByTokenRepositorySpy
  updateUserAttemptsRepositorySpy: UpdateUserAttemptsRepositorySpy
}

const makeSut = (): SutTypes => {
  const decrypterSpy = new DecrypterSpy()
  const loadUserByTokenRepositorySpy = new LoadUserByTokenRepositorySpy()
  const updateUserAttemptsRepositorySpy = new UpdateUserAttemptsRepositorySpy()
  const sut = new DbLoadUserByToken(decrypterSpy, loadUserByTokenRepositorySpy,updateUserAttemptsRepositorySpy)
  return {
    sut,
    decrypterSpy,
    loadUserByTokenRepositorySpy,
    updateUserAttemptsRepositorySpy
  }
}

let token: string
let role: string

describe('DbLoadUserByToken Usecase', () => {
  beforeEach(() => {
    token = faker.datatype.uuid()
    role = faker.random.word()
  })

  test('Should call Decrypter with correct ciphertext', async () => {
    const { sut, decrypterSpy } = makeSut()
    await sut.load(token, role)
    expect(decrypterSpy.ciphertext).toBe(token)
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterSpy } = makeSut()
    decrypterSpy.plaintext = null
    const user = await sut.load(token, role)
    expect(user).toBeNull()
  })

  test('Should call LoadUserByTokenRepository with correct values', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    await sut.load(token, role)
    expect(loadUserByTokenRepositorySpy.token).toBe(token)
    expect(loadUserByTokenRepositorySpy.role).toBe(role)
  })

  test('Should return null if LoadUserByTokenRepository returns null', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    loadUserByTokenRepositorySpy.result = null
    const user = await sut.load(token, role)
    expect(user).toBeNull()
  })

  test('Should return an user on success', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    const user = await sut.load(token, role)
    expect(user).toEqual(loadUserByTokenRepositorySpy.result)
  })

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypterSpy } = makeSut()
    jest.spyOn(decrypterSpy, 'decrypt').mockImplementationOnce(throwError)
    const user = await sut.load(token, role)
    await expect(user).toBeNull()
  })

  test('Should throw if LoadUserByTokenRepository throws', async () => {
    const { sut, loadUserByTokenRepositorySpy } = makeSut()
    jest.spyOn(loadUserByTokenRepositorySpy, 'loadByToken').mockImplementationOnce(throwError)
    const promise = sut.load(token, role)
    await expect(promise).rejects.toThrow()
  })

  // test('Should return null if user is called x times without success', async () => {
  //   const { sut, updateUserAttemptsRepositorySpy, loadUserByTokenRepositorySpy } = makeSut()
  //   process.env.PASSWD_MAX_ATTEMPTS = 3
  //   updateUserAttemptsRepositorySpy.attepmts = 3
  //   loadUserByTokenRepositorySpy.result.attempts = 3
  //   const user = await sut.load(token, role)
  //   expect(user).toBeNull()
  // })
})
