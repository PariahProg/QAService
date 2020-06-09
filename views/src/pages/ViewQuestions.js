import React, { Component } from 'react';
import noty from '../helpers/noty.js';
import { Container, Row, Card, Button, Badge, Pagination } from 'react-bootstrap';

class ViewQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      questionsCount: 0,
      pagesSize: 10,
      currentPage: 1,
      currentSection: 'questions',
      error: '',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.handleSelectCurrentQuestion(e.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.section !== prevProps.section) {
      this.setState({
        currentSection: this.props.section,
      });
      this.onPageChanged(1, this.props.section);
    }
  }

  componentDidMount() {
    this.onPageChanged(1, this.state.currentSection);
  }

  onPageChanged = (pageNumber, section) => {
    this.setState({
      currentPage: pageNumber,
    });
    fetch(`http://localhost:8080/${section}?pageNumber=${pageNumber}`)
      .then((response) => response.json())
      .then(({ status, questions, questionsCount }) => {
        if (status) {
          this.setState({
            questions: questions,
            questionsCount: questionsCount.count,
            error: '',
          })
      } else throw new Error('Ошибка загрузки вопросов')
      })
      .catch((error) => {
        console.error(error);
        noty(error.message, 'error');
        this.setState({ error: error.message });
      });
  };

  render() {
    const { questions, questionsCount, pagesSize } = this.state;
    const pagesCount = Math.ceil(questionsCount / pagesSize);
    const pages = [];
    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }
    return (
      <>
        <Container>
          <Row className="justify-content-center">
            <Pagination>
              <Pagination.First
                disabled={this.state.currentPage <= 1}
                onClick={(e) => {
                  this.onPageChanged(1, this.state.currentSection);
                }}
              />
              <Pagination.Prev
                disabled={this.state.currentPage <= 1}
                onClick={(e) => {
                  let curPage = this.state.currentPage;
                  this.setState({
                    currentPage: --curPage,
                  });
                  this.onPageChanged(curPage, this.state.currentSection);
                }}
              />
              {pages.map((p) => (
                <>
                  <Pagination.Item
                    key={p}
                    active={p === this.state.currentPage}
                    onClick={(e) => {
                      this.onPageChanged(p, this.state.currentSection);
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
                  this.onPageChanged(curPage, this.state.currentSection);
                }}
              />
              <Pagination.Last
                disabled={this.state.currentPage >= pagesCount}
                onClick={(e) => {
                  this.onPageChanged(pagesCount, this.state.currentSection);
                }}
              />
            </Pagination>
          </Row>
          <Row className="justify-content-center">
            {pagesCount !== 0 ? (
              questions.map((question) => (
                <>
                  <Card style={{ width: '17rem', margin: '0.5%' }} bg="light">
                    <Card.Body>
                      <Card.Title>{question.topic}</Card.Title>
                      <Card.Text>{question.text}</Card.Text>
                      <Button variant="info" onClick={() => this.handleClick(question)}>
                        Перейти
                      </Button>
                    </Card.Body>
                    <Card.Footer className="text-left">
                        <small>{question.name} > {question.subsection_id}</small>
                    </Card.Footer>
                  </Card>
                </>
              ))
            ) : this.state.error ? (
              <p style={{ color: 'red' }}>Ошибка загрузки вопросов</p>
            ) : (
              <>Хм, кажется, в этой категории нет вопросов</>
            )}
          </Row>
        </Container>
      </>
    );
  }
}

export default ViewQuestions;
