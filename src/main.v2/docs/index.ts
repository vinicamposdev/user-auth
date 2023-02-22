import components from './components'
import paths from './paths'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Basic Authentication API',
    description: 'This is not a fully functional API, but more a toy project focused on the design from an object- oriented point-of-view. It was built with an API template.',
    version: '1.0.0',
    contact: {
      name: 'Vinícius Campos',
      email: 'vinicius.campos@gmail.com',
      url: 'https://www.linkedin.com/in/vinicamposdev'
    },
    license: {
      name: 'GPL-3.0-or-later',
      url: 'https://spdx.org/licenses/GPL-3.0-or-later.html'
    }
  },
  servers: [{
    url: '/api/v1',
    description: 'Api V1 Path'
  },{
    url: '/api/v2',
    description: 'Api V2 Path'
  }],
  tags: [{
    name: 'Auth',
    description: 'Authentication Endpoints'
  }],
  paths,
  schemas,
  components
}
