import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Auth from '../hoc/auth'

import LandingPage from './views/LandingPage/LandingPage'
import MapContainer from './views/LandingPage/MapContainer'
import LoginPage from './views/LoginPage/LoginPage';
import RegisterPage from './views/RegisterPage/RegisterPage';
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import './views/main.css';

function App() {
  return (
    <Router>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null )  } />
          <Route exact path="/login" component={Auth(LoginPage, false) } />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/aptMap" component={Auth(MapContainer, null)} />
        </Switch>
      </div>
      <Footer />

    </Router>
  );
}

export default App;