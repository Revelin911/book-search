import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations'
import { GET_ME } from '../utils/queries';
// import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import type { User } from '../models/User';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData: User = data?.me || {
    username: '',
    email: '',
    password: '',
    savedBooks: [],
  };

const [removeBook] = useMutation(REMOVE_BOOK, {
  update: (cache: any, { data }: {data?: { removeBook: { bookId: string } } }) => {
    if (!data?.removeBook) return;
    
    const existingUser = cache.readQuery({ query: GET_ME });

    if (existingUser) {
      cache.writeQuery({
        query: GET_ME,
        data: {
          me: {
            ...existingUser.me,
            savedBooks: existingUser.me.savedBooks.filter((book: { bookId : string}) => book.bookId !== removeBook.bookId),
          },
        },
      });
    }
  },
});

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId: string) => {

    try {
      await removeBook({ variables: { bookId } });

      removeBookId(bookId);
     } catch(err) {
        console.error('something went wrong removing book!', err);
      }
  };
  
  //     const updatedUser = await response.json();
  //     setUserData(updatedUser);
  //     // upon success, remove book's id from localStorage
  //     removeBookId(bookId);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div className='text-light bg-dark p-5'>
        <Container>
          {userData.username ? (
            <h1>Viewing {userData.username}'s saved books!</h1>
          ) : (
            <h1>Viewing saved books!</h1>
          )}
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${
                userData.savedBooks.length === 1 ? 'book' : 'books'
              }:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md='4'>
                <Card key={book.bookId} border='dark'>
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant='top'
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className='btn-block btn-danger'
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
