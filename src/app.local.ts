// import express from 'serverless-express/express';
import app from './app';
import MongoService from './lib/mongodb';

// Call to app.listen to create local server for dev env.
MongoService.getConnection().then((connection) => {
  const port = parseInt(process.env['port'], 10) || 3300;
  app.listen(port, '0.0.0.0');

  console.log('App listenting on :', port);
});
