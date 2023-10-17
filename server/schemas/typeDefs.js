const typeDefs = `
type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]!
}

type Book {
    bookId: ID
    authors
}
`
//More to go here