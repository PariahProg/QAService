import React, { Component } from 'react';
import noty from '../helpers/noty.js';
import { Container, Row, Col, Card, Button, Badge, Pagination, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import got from '../helpers/got';

class ViewUserQuestions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			questionsCount: 0,
			pagesSize: 10,
			currentPage: 1,
			error: '',
			showModal: false,
			questionID: '',
			redirectQuestion: false,
		};
		this.handleClose = this.handleClose.bind(this);
		this.handleAuthProblem = this.handleAuthProblem.bind(this);
	}

	handleAuthProblem(e) {
		this.props.onAuthProblem();
	}

	componentDidMount() {
		this.setState({ redirectQuestion: false });
		this.onPageChanged(1);
	}

	componentDidUpdate() {
		if (this.state.error && sessionStorage.getItem('needRefreshToken') === '0') {
			this.setState({ error: '' });
			this.onPageChanged(1);
		}
	  }

	onPageChanged = (pageNumber) => {

		this.setState({ currentPage: pageNumber });

		got(`/user/questions?pageNumber=${pageNumber}`)
		.then((response) => {
			if (response.status === 401) {
			  this.handleAuthProblem();}
			  return response.json();
			})
		.then(({ status, questions, questionsCount }) => {
			if (!status) { throw new Error('Ошибка загрузки вопросов'); }
        	this.setState({ questions, questionsCount, error: '' });
			})
		.catch((error) => {
        	console.error(error);
        	//noty(error.message, 'error');
			this.setState({ error: error.message });
		});
	};

	handleClose(action) {
		const questionID = this.state.questionID;
		if (action !== 'delete')
			this.setState({
				showModal: false,
			});
		else {
			got(`/question/${questionID}/delete`, 'post')
				.then((response) => {
					if (response.status === 401) noty('Ошибка авторизации', 'warning');
					else if (response.status !== 200) return response.json(); 
					else {
						this.setState({ showModal: false });
						noty('Удаление вопроса прошло успешно', 'success');
						this.onPageChanged(this.state.currentPage);
					}
				})
				.catch((error) => {
					console.error(error);
					noty(`Ошибка удаления вопроса (${error.message})`, 'error');
					this.setState({ error: error.message });
				});
		}
	}

	handleShowModal(questionID) {
		this.setState({ showModal: true, questionID: questionID });
	}

	goToSelectedQuestion(questionID) {
		sessionStorage.setItem('onCurrentQuestion', 1);
		sessionStorage.setItem('questionID', questionID);
		this.setState({
			redirectQuestion:true
		})
	}

	render() {
		const { questions, questionsCount, pagesSize, showModal, redirectQuestion } = this.state;
		const pagesCount = Math.ceil(questionsCount / pagesSize);
		const pages = [];

		for (let i = 1; i <= pagesCount; i++) pages.push(i);

		if (redirectQuestion) {
			return <Redirect to='/q' />;
		}

		return (
			<>
				<Modal show={showModal} onHide={() => this.handleClose('close')} centered>
					<Modal.Header>
						<Modal.Title>Подтвердите удаление вопроса</Modal.Title>
					</Modal.Header>
					<Modal.Body>Вы действительно хотите удалить вопрос?</Modal.Body>
					<Modal.Footer>
						<Button variant='secondary' onClick={() => this.handleClose('close')}>
							Закрыть
						</Button>
						<Button id='delete' variant='danger' onClick={() => this.handleClose('delete')}>
							Удалить
						</Button>
					</Modal.Footer>
				</Modal>
				<Container>
					<Row className='justify-content-center'>
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
					<Row className='justify-content-center'>
						{pagesCount !== 0 ? (
							questions.map((question) => (
								<>
									<Card style={{ width: '17rem', margin: '0.5%' }} bg='light'>
										<Card.Body>
											<Card.Title>{question.topic}</Card.Title>
											<Card.Text>{question.text}</Card.Text>
											<Row className='justify-content-center'>
												<Col>
													<Button variant='info' onClick={() => this.goToSelectedQuestion(question.id)}>Перейти</Button>
												</Col>
												<Col>
													<Button
														variant='danger'
														onClick={() => this.handleShowModal(question.id)}
													>
														Удалить
													</Button>
												</Col>
											</Row>
										</Card.Body>
										<Card.Footer className='text-left'>
												<small>{question.name} > {question.subsection_id}</small>
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
		);
	}
}

export default ViewUserQuestions;
