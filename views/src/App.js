import React from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Main from './pages/Main';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Questions from './pages/Questions';
import CreateQuestion from './pages/CreateQuestion';
import CurrentQuestion from './pages/CurrentQuestion';
import Search from './pages/Search';

function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Header />
          <Layout>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route exact path="/questions" component={Questions} />
              <Route exact path="/create_question" component={CreateQuestion} />
              <Route exact path="/contacts" component={Contacts} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/current_question" component={CurrentQuestion} />
              <Route exact path="/search" component={Search}/>
            </Switch>
          </Layout>
        </Router>
        <Footer />
      </div>
    </>
  );
}

export default App;
