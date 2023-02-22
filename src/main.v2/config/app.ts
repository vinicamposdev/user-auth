import setupMiddlewares from '../../main.v2/config/middlewares'
import setupRoutes from '../../main.v2/config/routes'
import setupStaticFiles from '../../main.v2/config/static-files'
import setupSwagger from '../../main.v2/config/swagger'
import {setupApolloServer} from '../../main.v2/graphql/apollo'

import type {Express} from 'express'
import express from 'express'

import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import passport from 'passport'
import '../../main.v1/lib/authentication'
import MongoService from '../../main.v1/lib/mongodb'
import routes from '../../main.v1/routes'

export const setupApp = async (): Promise<Express> => {
  const app = express()
  setupStaticFiles(app)
  setupSwagger(app)
  setupMiddlewares(app)
  setupRoutes(app)
  const server = setupApolloServer()
  await server.start()
  server.applyMiddleware({ app })
  const production: boolean = process.env['production'] === 'true';

  const morganFormat = production ? 'combined' : 'dev';

  app.use(helmet());
  app.use(logger(morganFormat));
  app.use(compression());
  app.use(cors());

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json()); // To parse the incoming requests with JSON payloads

  // initialize passport with express
  app.use(passport.initialize());

  app.use('wv1/authenticated/*', passport.authenticate('jwt', { session: false }));

  // app.use('/api/authenticated/*', passport.authenticate('facebook', { session: false }));

  app.use((req, res, next) => {
    MongoService.getConnection().then(() => {
      next();
    });
  });

  routes(app);
  return app
}
