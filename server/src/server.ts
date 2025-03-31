import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import path from 'node:path';
import { typeDefs, resolvers } from './schemas/index.js';
import db from './config/connection.js';
import { fileURLToPath } from 'url';

// Implement the Apollo Server and apply it to the Express server as middleware.
const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new ApolloServer({ 
  typeDefs,
  resolvers,
});
const startApolloServer = async () => {
  await server.start();
  
  app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/graphql', expressMiddleware(server, {
  context: async ({ req }) => ({ token: req.headers.authorization }),
}));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join
      (__dirname, '../client/dist/index.html'));
  });
}

db.on('error',  console.error.bind(console, 'MongoDB connection error:'));
  
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on port ${PORT}`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
});
};

startApolloServer();