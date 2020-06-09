import React, { Component } from 'react';
import {Form, Row, Col, Card, Button} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import noty from '../helpers/noty';
import sections from '../helpers/sections';
import got from '../helpers/got';
import refreshToken from '../helpers/refreshToken';

class CreateQuestion extends Component {
    constructor(props){
        super(props);
        this.state = {
            topic:'',
            text:'',
            nameSection:'',
            selectSection:Object.keys(sections)[0],
            selectSubsection:'',
            authProblem: sessionStorage.getItem('needRefreshToken'),
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ authProblem: sessionStorage.getItem('needRefreshToken') });
      }

    handleInputChange(event){
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({ [name]: value });
    }

    handleSubmit(event){
        event.preventDefault();
        const {topic, text, selectSubsection} = this.state;
        got('/ask', 'post', {
            topic: topic,
            text:text,
            url: selectSubsection
        })
        .then(response => {
                if (!(response.status === 200)) {
                    noty(`Ошибка создания вопроса (${response.status})`, 'error');
                    if (response.status === 401) {    
                        this.setState({ authProblem: '1' });
                        sessionStorage.setItem('needRefreshToken', 1);
                        refreshToken()
                        .then(() => {
                            this.setState({ authProblem: sessionStorage.getItem('needRefreshToken') });
                            this.props.history.push('/create_question');
                      })
                    }
                }
                return response.json();
            })
            .catch(error => {
                noty(error.message, 'error');
                console.dir(error);
            })
    }

    render() {
        const { authProblem } = this.state; 
        if (!localStorage.getItem("accessToken")  || authProblem === '2')
            return (<><h3 style={{textAlign:"center"}}><NavLink exact to="/">Авторизуйтесь</NavLink>, чтобы задать вопрос</h3></>);
       
            return (
            <>
                <Row className="justify-content-md-center">
                    <Col md={6} >
                        <Card border="info">
                            <Card.Header><h4>Здесь Вы можете задать свой вопрос</h4></Card.Header>
                            <Card.Body>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="ControlSelect1">
                            <Form.Label>Выберите категорию *</Form.Label>
                            <Form.Control as="select" name="selectSection" onChange={this.handleInputChange} required>
                                <option value="">--------------</option>
                                {Object.keys(sections).map((nameSect) => <option value={nameSect}>{sections[nameSect].name}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="ControlSelect2">
                            <Form.Label>Выберите подкатегорию *</Form.Label>
                            <Form.Control as="select" name="selectSubsection" onChange={this.handleInputChange} required>
                                <option value="">--------------</option>
                                    {Object.keys(sections[this.state.selectSection].subsections).map(
                                        (nameSubsection) => <option value={nameSubsection}>{sections[this.state.selectSection].subsections[nameSubsection]}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="CotrolTopic">
                            <Form.Label>Вопрос *</Form.Label>
                            <Form.Control type="text" name="topic" onChange={this.handleInputChange} required></Form.Control>
                        </Form.Group>
                        <Form.Group controlId="ControlTextarea1">
                            <Form.Label>Описание вопроса</Form.Label>
                            <Form.Control as="textarea" rows="3" name="text" onChange={this.handleInputChange}/>
                        </Form.Group>
                        <Button variant="success" type="submit">Опубликовать вопрос</Button>
                        </Form>
                        </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        )
    }
}

export default CreateQuestion;
