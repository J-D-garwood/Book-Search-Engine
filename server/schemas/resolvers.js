const { User } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const Resolvers = {
  Query: {
    //to return the details of the current user and his/her savedBooks
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    //to create a new user account
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    // login for an existing user
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
    //to add a book and its details to the current user
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
    //to remove a book from the savedBooks of the current user
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
