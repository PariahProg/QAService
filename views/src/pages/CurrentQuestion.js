import React, { Component } from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Badge,
  Dropdown,
  Pagination,
  Form,
} from 'react-bootstrap';
import noty from '../helpers/noty.js';
import like from '../assets/like.png';
import got from '../helpers/got';

class CurrentQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionID: sessionStorage.getItem('questionID'), //this.props.question,
      question: {},
      answersCount: 0,
      answers: {},
      currentPage: 1,
      pageSize: 10,
      answerText: '',
      error: '',
      onLike: false,
      likedAnswers: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChangeAnswerPage = this.handleChangeAnswerPage.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick() {
    this.props.handleReturnToQuestions(false);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { answerText: text, questionID: question } = this.state;
    got('/answer', 'post', {
      text: text,
      question: question,
    })
      .then((response) => {
        if (!(response.status === 201 || response.status === 200)) {
          if (response.status === 401) {
            noty(`Авторизуйтесь, чтобы ответить на вопрос`, 'warning');
          } else {
            noty(`Ошибка ответа на вопрос (${response.status})`, 'error');
          }
          return response.json();
        } else {
          noty('Ответ успешно записан', 'success');
          this.handleChangeAnswerPage(this.state.currentPage);
          return response.json();
        }
      })
      .catch((error) => {
        noty(`Ошибка ответа на вопрос (${error.message})`, 'error');
        console.dir(error);
      });
  }

  handleChangeAnswerPage(pageNumber) {
    this.setState({
      currentPage: pageNumber,
    });
    got(`/question/${this.state.questionID}?pageNumber=${pageNumber}`, 'get')
      .then((response) => response.json())
      .then((result) => {
        if (result.status) {
          this.setState({
            question: result.question,
            answersCount: result.answersCount[0].answersCount,
            answers: result.answers,
            likedAnswers: result.likedAnswers,
          });
        } else result.json();
      })
      .catch((error) => {
        console.error(error);
        noty(`Ошибка загрузки вопроса (${error.message})`, 'error');
        this.setState({ error: error.message });
      });
  }

  handleLikeAnswer(answerID) {
    this.setState({ likedAnswerNumber: answerID });
    got(`/setLikeAnswer/${answerID}?pageNumber=${this.state.currentPage}&question_id=${this.state.questionID}`, 'post')
      .then((response) => {
        if (response.status !== 401) return response.json();
        else {
          noty('Авторизуйтесь, для того, чтобы поставить лайк', 'warning');
        }
      })
      .then((result) => {
        if (result.status) {
          this.setState({
            likedAnswers: result.likedAnswers,
            answers: result.answers,
          });
        } else result.json();
      })
      .catch((error) => {
        console.error(error);
        //noty(`Ошибка выставления лайка для ответа (${error.message})`, 'error');
        this.setState({ error: error.message, likedAnswers: [] });
      });
  }

  handleDislikeAnswer(answerID) {
    got(`/setDislikeAnswer/${answerID}?pageNumber=${this.state.currentPage}&question_id=${this.state.questionID}`, 'post')
      .then((response) => {
        if (response.status !== 401) return response.json();
        else {
          noty('Авторизуйтесь, для того, чтобы убрать лайк', 'warning');
        }
      })
      .then((result) => {
        this.setState({
          likedAnswers: result.likedAnswers,
          answers: result.answers,
        });
      })
      .catch((error) => {
        console.error(error);
        noty(`Ошибка выставления дизлайка для ответа (${error.message})`, 'error');
        this.setState({ error: error.message });
      });
  }

  componentWillUnmount() {
    sessionStorage.setItem('onCurrentQuestion', 0);
  }

  componentDidMount() {
    this.handleChangeAnswerPage(1);
  }

  render() {
    const { answers, answersCount, pageSize, likedAnswers } = this.state;
    const pagesCount = Math.ceil(answersCount / pageSize);
    const pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }
    return (
      <>
        <Container fluid>
          <Row className="justify-content-center">
            <Button onClick={this.handleClick} variant="info" size="sm">
              Вернуться обратно к вопросам
            </Button>
          </Row>
          <br />
          <Row className="justify-content-center">
            <Card style={{ width: '90%' }} border="info">
              <Card.Header>
                <Card.Title>{this.state.question.topic}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>{this.state.question.text}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Row className="justify-content-center">
                  <Col>
                    <small>Категория: {this.state.question.section_name}</small>
                    <Dropdown.Divider />
                    <Badge>Автор: {this.state.question.user_login}</Badge>
                    <Badge>Дата: {this.state.question.date}</Badge>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Row>
          <Row className="justify-content-center">
            <Card style={{ width: '70%', margin: '0.4%' }} border="secondary">
              <Card.Body>
                <Card.Title>Ответить на вопрос</Card.Title>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group>
                    <Form.Label>Введите текст ответа</Form.Label>
                    <Form.Control
                      onChange={this.handleInputChange}
                      name="answerText"
                      as="textarea"
                      rows="2"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Ответить
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Row>
          <Row className="justify-content-center">
            <b>Ответы</b>
          </Row>
          <Row className="justify-content-center">
            {pagesCount !== 0 ? (
              answers.map((answer) => (
                <>
                  <Card style={{ width: '28rem', margin: '0.2%' }} bg="light">
                    <Card.Body>
                      <Card.Text>
                        <b>{answer.username}</b>
                      </Card.Text>
                      <Card.Text>{answer.text}</Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-right">
                      <img
                        style={
                          likedAnswers
                            ? likedAnswers.find((item) => item.id === answer.id)
                              ? { width: '5%', cursor: 'pointer', filter: 'opacity(1)' }
                              : { width: '5%', cursor: 'pointer', filter: 'opacity(0.5)' }
                            : { width: '5%', cursor: 'pointer', filter: 'opacity(0.2)' }
                        }
                        src={like}
                        alt={'like'}
                        onClick={() => {
                          likedAnswers.find((item) => item.id === answer.id)
                            ? this.handleDislikeAnswer(answer.id)
                            : this.handleLikeAnswer(answer.id);
                        }}
                      />
                      <Badge>Рейтинг: {answer.like_counter}</Badge>
                    </Card.Footer>
                  </Card>
                </>
              ))
            ) : this.state.error ? (
              <p style={{ color: 'red' }}>Ошибка загрузки ответов</p>
            ) : (
              <p>Хм, кажется, для этого вопроса ещё нет ответов</p>
            )}
          </Row>
          <Row className="justify-content-center">
            <Pagination>
              <Pagination.First
                disabled={this.state.currentPage <= 1}
                onClick={(e) => {
                  this.handleChangeAnswerPage(1);
                }}
              />
              <Pagination.Prev
                disabled={this.state.currentPage <= 1}
                onClick={(e) => {
                  let curPage = this.state.currentPage;
                  this.setState({
                    currentPage: --curPage,
                  });
                  this.handleChangeAnswerPage(curPage);
                }}
              />
              {pages.map((p) => (
                <>
                  <Pagination.Item
                    key={p}
                    active={p === this.state.currentPage}
                    onClick={(e) => {
                      this.handleChangeAnswerPage(p);
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
                  this.handleChangeAnswerPage(curPage);
                }}
              />
              <Pagination.Last
                disabled={this.state.currentPage >= pagesCount}
                onClick={(e) => {
                  this.handleChangeAnswerPage(pagesCount);
                }}
              />
            </Pagination>
          </Row>
        </Container>
      </>
    );
  }
}

export default CurrentQuestion;
