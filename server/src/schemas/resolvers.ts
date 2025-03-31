import User from '../models/User'
import { signToken, AuthenticationError } from '../services/auth.js';

// Define the query and mutation functionality to work with the Mongoose models

const resolvers = {
  Query: {
    me: async (_parent: unknown, _args: unknown, context: { user: any }) => {
      if (context.user) {
        // If user is authenticated, return their profile
        return await User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If not authenticated, throw an authentication error
      throw new AuthenticationError('Not Authenticated');
    },
  },

  Mutation: {
   login: async (_parent: any, { email, password }: { email: string; password: string }) => { 
    const user = await User.findOne({ email });
     if (!user || !(await user.isCorrectPassword(password))) {
      throw new AuthenticationError('User or password incorrect');
     }
      const token= signToken(user.username, user.email, user._id);
      return { token, user };
    },

      // Create a new user with provided name, email, and password
      addUser: async (_parent: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
        const user = await User.create({ username, email, password });
const token = signToken(user.username, user.email, user._id);
return { token, user };
      },

    // Save book to user's profile
    saveBook: async (_parent: any, { book }: { book: any }, context: { user: any }) => {
      // If context has a `user` property, that means the user executing this mutation has a valid JWT and is logged in
      if (context.user) {
        // Add a book to a profile identified by profileId
        return await User.findOneAndUpdate(
          { _id: context.user._Id },
          {
            $push: { savedBooks: book }
          },
          {
            new: true,
            runValidators: true
          }
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError('Could not find user');
    },

    // Set up mutation so a logged in user can only remove their book
    removeBook: async (_parent: unknown, { bookId }: { bookId: string }, context: { user: any }) => {
      if (context.user) {
        return await User.findOneAndUpdate({ _id: context.user._id },
          { 
            $pull: { savedBooks: { bookId } } 
          },
          { new: true }
        );
      }
      // If user attempts to execute this mutation and isn't logged in, throw an error
      throw new AuthenticationError('Could not find user');
    },
  },
};

export default resolvers;