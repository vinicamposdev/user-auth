import { adaptResolver } from '../../../main.v2/adapters'
import { makeLoginController, makeSignUpController } from '../../../main.v2/factories'

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args)
  },

  Mutation: {
    signUp: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args)
  }
}
