var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./components/App');

var wrapper = document.getElementById('wrapper');


console.log(wrapper.dataset.emotions);

ReactDOM.render(
  <App emotions={JSON.parse(wrapper.dataset.emotions)} emotion={wrapper.dataset.emotion} />,
  wrapper
);