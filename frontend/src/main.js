var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;

var App = require('./components/App');
var Home = require('./components/Home');
var Playlist = require('./components/Playlist');

var wrapper = document.getElementById('wrapper');

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="playlist/:emotion" component={Playlist} />
    </Route>
  </Router>
), wrapper);