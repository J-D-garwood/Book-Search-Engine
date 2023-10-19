import { Container, Card, Button, Row, Col } from "react-bootstrap";

import { removeBookId } from "../utils/localStorage";
//importing
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { useMutation } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { Link } from "react-router-dom";

// importing context
const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || data?.user || {};

  const [removeBook, { error }] = useMutation(REMOVE_BOOK);

  //function that deletes book from DB based on _id 
  const handleDeleteBook = async (bookId) => {
    try {
      const { data } = await removeBook({ variables: { bookId: bookId } });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) {
    return <h2>data still loading..</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className="pt-5">
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border="dark">
                  <Link to={book.link} target="_blank" rel="noreferrer">
                    {book.image ? (
                      <Card.Img
                        src={book.image}
                        alt={`The cover for ${book.title}`}
                        variant="top"
                      />
                    ) : null}
                  </Link>
                  <Card.Body>
                    <a href={book.link} target="_blank" rel="noreferrer">
                      <Card.Title>{book.title}</Card.Title>
                    </a>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;