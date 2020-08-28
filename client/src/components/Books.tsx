import * as React from 'react'
import { History } from 'history'
import {
  Image, Loader, Icon, Header, Grid, Button, Divider, Input
} from 'semantic-ui-react'

import { createBook, deleteBook, getBooks } from '../api/books-api'
import Auth from '../auth/Auth'
import { Book } from '../types/Book'

interface Booksprop {
  auth: Auth
  history: History
}

interface BooksState {
  books: Book[]
  newBookName: string
  loadingBooks: boolean
}

export class Books extends React.PureComponent<Booksprop, BooksState> {
  state: BooksState = {
    books: [],
    newBookName: '',
    loadingBooks: true
  }

  handleNameChangee = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  }

  onDownloadButtonClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    
  }

  onBookCreate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(this.props.auth.getIdToken() + ' from Books onBookCreate')
    try {
      const newBook = await createBook(this.props.auth.getIdToken(), {
        name: this.state.newBookName
      })
      this.setState({
        books: [...this.state.books, newBook],
        newBookName: ''
      })
    } catch (error) {
      alert('Book creation failed ' + error.message)
    }
  }

  onBookDelete = async (bookId: string) => {
    try {
      await deleteBook(this.props.auth.getIdToken(), bookId)
      this.setState({
        books: this.state.books.filter((book) => book.bookId != bookId)
      })
    } catch (error) {
      alert('Book deletion failed: ' + error.message)
    }
  }

  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      console.log(JSON.stringify(books))
      this.setState({
        books,
        loadingBooks: false
      })
    } catch (error) {
      alert(`Failed to fetch books: ${error.message}`)
    }
  }

  render() {
      return (
          <div>
              <Header as="h1">BOOKs</Header>
              {this.renderCreateBookInput()}
              {this.renderBooks()}
          </div>
      )
  }

  renderCreateBookInput() {
      return (
          <Grid.Row>
              <Grid.Column width={16}>
                <Input
                action={{
                    color: 'teal',
                    labelPosition: 'left',
                    icon: 'add',
                    content: 'New Book',
                    onClick: this.onBookCreate
                }}
                fluid
                actionPosition="left"
                placeholder="A reader is a leader..."
                onChange={this.handleNameChangee}
                />
              </Grid.Column>
              <Grid.Column width={16}>
              <Divider/>
              </Grid.Column>
          </Grid.Row>
      )
  }

renderBooks() {
    if(this.state.loadingBooks) {
        return this.renderLoading()
    }

    return this.renderBooksList()
}

renderLoading() {
    return (
        <Grid.Row>
            <Loader indeterminate active inline="centered">
                Loading Books
            </Loader>
        </Grid.Row>
    )
}

renderBooksList() {
    return (
        <Grid padded>
            {this.state.books.map((book, pos) => {
                return (
                    <Grid.Row key={book.bookId}>
                        <Grid.Column width={10} verticalAlign="middle">
                            {book.name}
                        </Grid.Column>
                        <Grid.Column width={1} floated="right">
                            <Button
                            icon
                            color="blue"
                            onClick={() => this.onEditButtonClick(book.bookId)}
                            >
                                <Icon name="pencil"/>
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={1} floated="right">
                            <Button
                            icon
                            color="blue"
                            >
                                <Icon name="download"/>
                            </Button>
                        </Grid.Column>
                        <Grid.Column width={1} floated="right">
                          <Button
                          icon
                          color="red"
                          onClick={() => this.onBookDelete(book.bookId)}
                          >
                            <Icon name="delete"/>
                          </Button>
                          </Grid.Column>
                          
                          <Grid.Column width={16}>
                            <Divider/>
                          </Grid.Column>
                    </Grid.Row>
                )
            })}
        </Grid>
    )
}
}
