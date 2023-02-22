export const unauthorized = {
  description: 'Wrong Credentials',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
