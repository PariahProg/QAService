import React, { Component } from 'react';
import noty from '../helpers/noty.js';
import { Container, Row, Col, Card, Button, Badge, Pagination,Modal } from 'react-bootstrap';
import got from '../helpers/got';

class ViewUserAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [],
      questions: [],
      questionsCount: 0,
      pagesSize: 10,
      currentPage: 1,
      error: '',
      showModal: false,
      answerID: '',
    };
  }

  componentDidMount() {
    this.onAnswersPageChanged(1);
  }

  componentDidUpdate() {
    if (this.state.error && sessionStorage.getItem('needRefreshToken') === '0') {
      this.setState({ error: '' });
      this.onAnswersPageChanged(1);
    }
  }


  onAnswersPageChanged = (pageNumber) => {
    this.setState({
      currentPage: pageNumber,
    });
    got(`/user/answers?pageNumber=${pageNumber}`)
      .then((response) => {
        if (response.status === 401) {
          this.props.onAuthProblem();
        }
        
        return response.json();
      })
      .then(({ status, questions, questionsCount, answers }) => {
        if (!status) {
          throw new Error('Ошибка загрузки ответов');
        }
        
        this.setState({ questions, questionsCount, answers, error: '' });
      })
      .catch((error) => {
        console.error(error);
        //noty(error.message, 'error');
        this.setState({ error: error.message });
      });
  };

  handleShowModal(answerID) {
    this.setState({
      showModal: true,
      answerID: answerID,
    });
  }

  handleClose(action) {
    const answerID = this.state.answerID;
    if (action !== 'delete')
      this.setState({
        showModal: false,
      });
    else {
      got(`/answer/${answerID}/delete`, 'post', JSON.stringify({}))
        .then((response) => {
          if (response.status === 401) noty("Ошибка авторизации", 'warning');
          else if (response.status !== 200) return response.json();
          else {
            this.setState({ showModal: false });
            noty('Удаление ответа прошло успешно', 'success');
            this.onAnswersPageChanged(this.state.currentPage);
          }
        })
        .catch((error) => {
          console.error(error);
          noty(`Ошибка удаления ответа (${error.message})`, 'error');
          this.setState({ error: error.message });
        });
    }
  }

  render() {
    const { error } = this.state;
    if (error)
      return (
        <>
          <p style={{ color: 'red' }}>Ошибка загрузки ответов</p>
        </>
      );
    else {
      const { questions, pagesSize, answers, questionsCount, showModal } = this.state;
      const pagesCount = Math.ceil(questionsCount / pagesSize);
      const pages = [];
      for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
      }
      return (
        <>
          <Modal show={showModal} onHide={() => this.handleClose('close')} centered>
            <Modal.Header>
              <Modal.Title>Подтвердите удаление ответа</Modal.Title>
            </Modal.Header>
            <Modal.Body>Вы действительно хотите удалить ответ?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => this.handleClose('close')}>
                Закрыть
              </Button>
              <Button id="delete" variant="danger" onClick={() => this.handleClose('delete')}>
                Удалить
              </Button>
            </Modal.Footer>
          </Modal>
          <Container>
            <Row className="justify-content-center">
              <Pagination>
                <Pagination.First
                  disabled={this.state.currentPage <= 1}
                  onClick={(e) => {
                    this.onAnswersPageChanged(1, this.state.currentSection);
                  }}
                />
                <Pagination.Prev
                  disabled={this.state.currentPage <= 1}
                  onClick={(e) => {
                    let curPage = this.state.currentPage;
                    this.setState({
                      currentPage: --curPage,
                    });
                    this.onAnswersPageChanged(curPage, this.state.currentSection);
                  }}
                />
                {pages.map((p) => (
                  <>
                    <Pagination.Item
                      key={p}
                      active={p === this.state.currentPage}
                      onClick={(e) => {
                        this.onAnswersPageChanged(p, this.state.currentSection);
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
                    this.onAnswersPageChanged(curPage, this.state.currentSection);
                  }}
                />
                <Pagination.Last
                  disabled={this.state.currentPage >= pagesCount}
                  onClick={(e) => {
                    this.onAnswersPageChanged(pagesCount, this.state.currentSection);
                  }}
                />
              </Pagination>
            </Row>
            <Row className="justify-content-center">
                {pagesCount !== 0 ? (
                  questions.map((question) => (
                    <>
                      <Card style={{ width: '100%', margin: '0.5%' }} border="dark" bg="light">
                        <Card.Body>
                          <Card.Title>{question.topic}</Card.Title>
                          <Card.Text>{question.text}</Card.Text>
                        </Card.Body>
                        <Card.Footer className="text-right">
                          <Badge variant="dark">
                            {question.name} > {question.subsection_id}
                          </Badge>
                          <hr />
                          <Badge>Дата: {question.date}</Badge>
                        </Card.Footer>
                        <Row className="justify-content-center">
                          {answers.map((answer) => {
                            if (answer.question_id === question.id)
                              return (
                                <>
                                  <Card
                                    style={{ width: '80%', margin: '0.5%' }}
                                    border="info"
                                    bg="light"
                                  >
                                    <Card.Body>
                                      <Card.Text>{answer.text}</Card.Text>
                                      <Row className="justify-content-center">
                                        <Col>
                                          <Button
                                            variant="danger"
                                            onClick={() => this.handleShowModal(answer.id)}
                                          >
                                            Удалить
                                          </Button>
                                        </Col>
                                      </Row>
                                    </Card.Body>
                                    <Card.Footer className="text-right">
                                      <Badge>Рейтинг: {answer.like_counter}</Badge>
                                    </Card.Footer>
                                  </Card>
                                </>
                              );
                          })}
                        </Row>
                      </Card>
                    </>
                  ))
                ) : this.state.error ? (
                  <p style={{ color: 'red' }}>Ошибка загрузки ответов</p>
                ) : (
                  <>Хм, кажется, здесь нет ответов</>
                )}
            </Row>
          </Container>
        </>
      );
    }
  }
}

export default ViewUserAnswer;
