import React, { Component } from 'react';
import { Card, Container, Row, Pagination, Col, Button, Badge } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import noty from '../helpers/noty';
import got from '../helpers/got';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      onClick: false,
      text: '',
      resultQuestions: [],
      questionsCount: 0,
      currentPage: 1,
      pagesSize: 10,
      error: '',
    };
  }

  componentDidMount() {
    this.setState({
      text: sessionStorage.getItem('searchText'),
    });
    this.search(1);
  }

  search(curPage) {
    const text = sessionStorage.getItem('searchText');
    this.setState({
      currentPage: curPage,
    });
    this.setState({ isLoading: true });
    got(`/search?text=${text}&pageNumber=${curPage}`, 'get')
        .then((response) => {
                if (response.status !== 200) {
                noty(`Ошибка (${response.message})`, 'error');
                this.setState({ isLoading: false });
                return response.json();
                } else return response.json();
            })
        .then(({ status, foundQuestions, questionsCount}) => {
            if (status) {
            this.setState({
                isLoading: false,
                resultQuestions: foundQuestions,
                questionsCount
            });
            } else throw new Error('Ошибка поиска')
        })
        .catch((error) => {
        console.error(error);
        this.setState({
          error: error.message,
          isLoading: false,
        });
        noty(error.message, 'error');
      });
  }

  handleClick(question) {
    const questionID = question.id; 
    this.setState({
      onClick: true,
    });
    sessionStorage.setItem('onCurrentQuestion', 1);
    sessionStorage.setItem('questionID', questionID);
  }

  render() {
    const { resultQuestions, questionsCount, pagesSize, error, isLoading, onClick } = this.state;
    const pagesCount = Math.ceil(questionsCount / pagesSize);
    const pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }
    if (error)
      return (
        <>
          <Card>
            <Card.Body>
              <Card.Title>Результаты поиска</Card.Title>
              <Card.Text>Ошибка</Card.Text>
            </Card.Body>
          </Card>
        </>
      );
    else if (onClick)
      return (
        <>
          <Redirect to="/q" />
        </>
      );
    else
      return (
        <>
          <Card>
            <Card.Body>
              <Card.Title>Результаты поиска</Card.Title>
              {isLoading ? (
                <Card.Text>Загрузка...</Card.Text>
              ) : (
                <>
                  <Container>
                    <Row className="justify-content-center">
                      <Pagination>
                        <Pagination.First
                          disabled={this.state.currentPage <= 1}
                          onClick={(e) => {
                            this.search(1, this.state.currentSection);
                          }}
                        />
                        <Pagination.Prev
                          disabled={this.state.currentPage <= 1}
                          onClick={(e) => {
                            let curPage = this.state.currentPage;
                            this.setState({
                              currentPage: --curPage,
                            });
                            this.search(curPage, this.state.currentSection);
                          }}
                        />
                        {pages.map((p) => (
                          <>
                            <Pagination.Item
                              key={p}
                              active={p === this.state.currentPage}
                              onClick={(e) => {
                                this.search(p, this.state.currentSection);
                              }}
                              href={`#${p}`}
                            >
                              {p}
                            </Pagination.Item>
                          </>
                        ))}
                        <Pagination.Next
                          disabled={this.state.currentPage >= pagesCount}
                          onClick={(e) => {
                            let curPage = this.state.currentPage;
                            this.setState({
                              currentPage: ++curPage,
                            });
                            this.search(curPage, this.state.currentSection);
                          }}
                        />
                        <Pagination.Last
                          disabled={this.state.currentPage >= pagesCount}
                          onClick={(e) => {
                            this.search(pagesCount, this.state.currentSection);
                          }}
                        />
                      </Pagination>
                    </Row>
                    <Row className="justify-content-center">
                      {pagesCount !== 0 ? (
                        resultQuestions.map((question) => (
                          <>
                            <Card style={{ width: '17rem', margin: '0.5%' }} bg="light">
                              <Card.Body>
                                <Card.Title>{question.topic}</Card.Title>
                                <Card.Text>{question.text}</Card.Text>
                                <Row className="justify-content-center">
                                  <Col>
                                    <Button
                                      variant="info"
                                      onClick={() => this.handleClick(question)}
                                    >
                                      Перейти
                                    </Button>
                                  </Col>
                                </Row>
                              </Card.Body>
                              <Card.Footer className="text-right">
                                <small>{question.section_name}</small>
                                <hr />
                                <Badge>Дата: {question.date}</Badge>
                              </Card.Footer>
                            </Card>
                          </>
                        ))
                      ) : this.state.error ? (
                        <p style={{ color: 'red' }}>Ошибка загрузки вопросов</p>
                      ) : (
                        <>Хм, кажется, здесь нет вопросов</>
                      )}
                    </Row>
                  </Container>
                </>
              )}
            </Card.Body>
          </Card>
        </>
      );
  }
}

export default Search;
