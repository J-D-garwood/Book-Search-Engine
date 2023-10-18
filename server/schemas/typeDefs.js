const typeDefs = `
type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
}

type Book {
    bookId: ID!
    authors: [String]!
    description: String!
    title: String!
    image: String!
    link: String!
}

type Auth {
    token: ID!
    user: User
}

type Query {
    me: User
}

type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(authors: [String]!, description: String!, bookId: ID!, image: String!, link: String!, title: String!): Book
    removeBook(bookId: ID!): Book
  }

`

module.exports = typeDefs
//More to go here