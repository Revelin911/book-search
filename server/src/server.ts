import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { fileURLToPath } from 'url';
import type { Request, Response } from 'express';
import { authenticateToken } from './services/auth.js';
import dotenv from 'dotenv';

dotenv.config();

// Implement the Apollo Server and apply it to the Express server as middleware.
const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
});
// const startApolloServer = async () => {
//   await server.start();
//   await db;
  
//   app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use('/graphql', expressMiddleware(server as any, {
//   context: authenticateToken as any }
// ));

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/dist')));

//   app.get('*', (_req: Request, res: Response) => {
//     res.sendFile(path.join
//       (__dirname, '../client/dist/index.html'));
//   });
// }
  
//   app.listen(PORT, () => {
//     console.log(`🌍 Now listening on port ${PORT}`);
//     console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
// });
// };

const startApolloServer = async () => {
  await server.start();
  await db;
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    }
  ));
  if (process.env.NODE_ENV === 'production') {
    console.log('running in production')
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};


startApolloServer();