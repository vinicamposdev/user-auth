import {gql} from 'apollo-server-express'

export default gql`
  extend type Query {
    login (email: String!, password: String!): User!
  }

  extend type Mutation {
    signUp (name: String!, email: String!, password: String!, passwordConfirmation: String!): User!
  }

  type User {
    accessToken: String!
    name: String!
  }
`
