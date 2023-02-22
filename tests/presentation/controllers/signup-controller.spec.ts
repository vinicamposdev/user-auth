import {AddUserSpy, AuthenticationSpy, ValidationSpy} from '@/tests/presentation/mocks'
import {SignUpController} from '../../../src/presentation/controllers'
import {EmailInUseError, MissingParamError, ServerError} from '../../../src/presentation/errors'
import {badRequest, forbidden, ok, serverError} from '../../../src/presentation/helpers'

import {throwError} from '@/tests/domain'
import {faker} from '@faker-js/faker'
import {RolePretty} from '../../../src/domain/value-objects/roles'

const mockRequest = (): SignUpController.Request => {
  const password = faker.internet.password()
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
    dob: '1990-01-01',
    role: RolePretty.Guest
  }
}

type SutTypes = {
  sut: SignUpController
  addUserSpy: AddUserSpy
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const makeSut = (): SutTypes => {
  const authenticationSpy = new AuthenticationSpy()
  const addUserSpy = new AddUserSpy()
  const validationSpy = new ValidationSpy()
  const sut = new SignUpController(addUserSpy, validationSpy, authenticationSpy)
  return {
    sut,
    addUserSpy,
    validationSpy,
    authenticationSpy
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddUser throws', async () => {
    const { sut, addUserSpy } = makeSut()
    jest.spyOn(addUserSpy, 'add').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call AddUser with correct values', async () => {
    const { sut, addUserSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(addUserSpy.params).toEqual({
      name: request.name,
      email: request.email,
      password: request.password,
      attempts: 0,
      dob: request.dob,
      role: request.role
    })
  })

  test('Should return 403 if AddUser returns false', async () => {
    const { sut, addUserSpy } = makeSut()
    addUserSpy.result = false
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut, authenticationSpy } = makeSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok(authenticationSpy.result))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(validationSpy.input).toEqual(request)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.error = new MissingParamError(faker.random.word())
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(validationSpy.error))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()
    const request = mockRequest()
    await sut.handle(request)
    expect(authenticationSpy.params).toEqual({
      email: request.email,
      password: request.password
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()
    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
