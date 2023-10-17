const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('thoughts');
            }
            throw AuthenticationError;
          },
    },
    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError;
            }
            const token = signToken(user);

            return { token, user};
        },
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { authors, description, bookId, image, link, title}, context) => {
            if (context.user) {
                const book = await Book.create({
                    authors,
                    description,
                    bookId,
                    image,
                    link,
                    title
                });

                const user = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: book._id } }
                );
                return user;
            }
            throw AuthenticationError;
        },
        //add saveBook mutation
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const book = await Book.findOneAndDelete({
                _id: bookId,
              });
      
              const user = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: book._id } }
              );
      
              return user;
            }
            throw AuthenticationError;
          },
        },
    }

module.exports = resolvers;