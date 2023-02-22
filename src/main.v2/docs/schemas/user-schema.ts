export const userSchema = {
  type: 'object',
  properties: {
    accessToken: {
      type: 'string'
    },
    name: {
      type: 'string'
    }
  },
  required: ['accessToken', 'name']
}
