import gql from "graphql";

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            savedBooks {
                bookId
                authors
                description
                image
                link
                title
            }
        }
    }
`