// import express from 'serverless-express/express';
import cors from 'cors';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';
import './lib/authentication';
import routes from './routes';
import express from 'express';
import MongoService from './lib/mongodb';

const app = express();

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

app.use('/api/authenticated/*', passport.authenticate('jwt', { session: false }));

// app.use('/api/authenticated/*', passport.authenticate('facebook', { session: false }));

app.use((req, res, next) => {
  MongoService.getConnection().then(() => {
    next();
  });
});

routes(app);

// Export your express server so you can import it in the serverless function.
export default app;
