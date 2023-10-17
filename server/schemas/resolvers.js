const { Book, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        /*me: */
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
    }
}

module.exports = resolvers;