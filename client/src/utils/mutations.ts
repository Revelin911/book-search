import { gql } from '@apollo/client';

export const LOGIN_USER = gql `
mutation loginUser($email: String!, $password: String!) {
login(email: $email, password: $password) {
token
user {
_id
username
email
}
}
}
`;

export const ADD_USER = gql `
mutation addUser($username: String!, $email: String!, $password: String!) {
addUser(username: $username, email: $email, password: $password) {
token
user {
_id
username
email
}
}
}
`;

export const SAVE_BOOK = gql `
mutation saveBook($book: BookInput!) {
saveBook(book: $book) {
_id
username
email
savedbooks {
bookId
authors
description
title
image
link
}
}
}
`;

export const REMOVE_BOOK = gql `
mutation removeBook($bookid: String!) {
removeBook(bookId: $bookId) {
_id
username
email
savedBooks {
bookId
authors
description
title
image
link
}
}
}
`;