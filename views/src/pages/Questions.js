import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import ViewQuestions from './ViewQuestions.js';
import sections from '../helpers/sections.js';
import TreeMenu from 'react-simple-tree-menu';
import '../../node_modules/react-simple-tree-menu/dist/main.css';
import CurrentQuestion from './CurrentQuestion'; 

class Questions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      error: '',
      sections: [],
      totalCountPages: 0,
      currentSection: 'questions',
      rootSectionLabel: '',
      currentSectionLabel: 'Все категории',
      currentQuestion: 0,
      onCurrentQuestion: '0',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleReturnToQuestions = this.handleReturnToQuestions.bind(this);
    this.handleSelectCurrentQuestion = this.handleSelectCurrentQuestion.bind(this);
  }

  componentDidMount() {
    sessionStorage.getItem('onCurrentQuestion')
      ? this.setState({
          onCurrentQuestion: sessionStorage.getItem('onCurrentQuestion'),
        })
      : this.setState({
          onCurrentQuestion: '0',
        });
  }

  handleSelectCurrentQuestion(questionID) {
    this.setState({
      currentQuestion: questionID,
      onCurrentQuestion: '1',
    });
    sessionStorage.setItem('onCurrentQuestion', 1);
    sessionStorage.setItem('questionID', questionID);
  }

  handleReturnToQuestions() {
    this.setState({
      onCurrentQuestion: '0',
    });
    sessionStorage.setItem('onCurrentQuestion', 0);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState({
      [name]: value,
    });
  }

  render() {
    var seubsectMenu = [
      {
        key: 'questions',
        pureSectionName: 'questions',
        label: 'Все категории',
        nodes: [],
      },
    ];
    Object.keys(sections).map((nameSect) => {
      var array = [];
      Object.keys(sections[nameSect].subsections).map((subsectsName) => {
        array = [
          ...array,
          {
            key: subsectsName,
            pureSectionName: subsectsName,
            label: sections[nameSect].subsections[subsectsName],
            rootLabel: sections[nameSect].name,
            nodes: [],
          },
        ];
      });
      seubsectMenu = [
        ...seubsectMenu,
        {
          key: nameSect,
          pureSectionName: nameSect,
          label: sections[nameSect].name,
          nodes: array,
        },
      ];
    });
    return (
      <>
        <Row>
          <Col md={3}>
            <TreeMenu
              data={seubsectMenu}
              onClickItem={({ pureSectionName, label, rootLabel }) => {
                this.setState({
                  currentSection: pureSectionName,
                  currentSectionLabel: label,
                  rootSectionLabel: rootLabel,
                  onCurrentQuestion: '0',
                });
                sessionStorage.setItem('onCurrentQuestion', 0);
              }}
              hasSearch={false}
              initialActiveKey="questions"
            />
          </Col>
          <Col>
            <Row className="justify-content-center">
              {!this.state.onCurrentQuestion ? (
                !this.state.rootSectionLabel ? (
                  <p>{this.state.currentSectionLabel}</p>
                ) : (
                  <p>
                    {this.state.rootSectionLabel} > {this.state.currentSectionLabel}
                  </p>
                )
              ) : (
                <></>
              )}
            </Row>
            <Row className="justify-content-center">
              {this.state.onCurrentQuestion === '0' ? (
                <ViewQuestions
                  section={this.state.currentSection}
                  handleSelectCurrentQuestion={this.handleSelectCurrentQuestion}
                />
              ) : (
                <CurrentQuestion
                  question={this.state.currentQuestion}
                  handleReturnToQuestions={this.handleReturnToQuestions}
                />
              )}
            </Row>
          </Col>
        </Row>
      </>
    );
  }
}

export default Questions;
