var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App');

var wrapper = document.getElementById('wrapper');

ReactDOM.render(
  <App showMenu={false} emotions={['test1', 'test2']} emotion={wrapper.dataset.emotion} />,
  wrapper
);