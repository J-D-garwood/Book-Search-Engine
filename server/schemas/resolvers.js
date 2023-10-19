const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const Resolvers = {
  Query: {
    //returns user details
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    //creates new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // logs in existing user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },
    //adds a book to users saved books 
    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const user = User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: input,
            },
          },
          { new: true }
        );
        return user;
      }
      throw AuthenticationError;
    },
    //removes a book from saved books
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return user;
      }
      throw AuthenticationError;
    },
  },
};
module.exports = Resolvers;
