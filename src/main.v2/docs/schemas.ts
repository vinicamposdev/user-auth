import {errorSchema, loginParamsSchema, signUpParamsSchema, userSchema} from './schemas/index'

export default {
  user: userSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
}
