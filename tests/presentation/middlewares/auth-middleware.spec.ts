import {throwError} from '@/tests/domain'
import {LoadUserByTokenSpy} from '@/tests/presentation/mocks'
import {AccessDeniedError} from '../../../src/presentation/errors'
import {forbidden, ok, serverError} from '../../../src/presentation/helpers'
import {AuthMiddleware} from '../../../src/presentation/middlewares'

const mockRequest = (): AuthMiddleware.Request => ({
  accessToken: 'any_token'
})

type SutTypes = {
  sut: AuthMiddleware
  loadUserByTokenSpy: LoadUserByTokenSpy
}

const makeSut = (role?: string): SutTypes => {
  const loadUserByTokenSpy = new LoadUserByTokenSpy()
  const sut = new AuthMiddleware(loadUserByTokenSpy, role)
  return {
    sut,
    loadUserByTokenSpy
  }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadUserByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadUserByTokenSpy } = makeSut(role)
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(loadUserByTokenSpy.accessToken).toBe(httpRequest.accessToken)
    expect(loadUserByTokenSpy.role).toBe(role)
  })

  test('Should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    loadUserByTokenSpy.result = null
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadUserByToken returns an user', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({
      userId: loadUserByTokenSpy.result.id
    }))
  })

  test('Should return 500 if LoadUserByToken throws', async () => {
    const { sut, loadUserByTokenSpy } = makeSut()
    jest.spyOn(loadUserByTokenSpy, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
