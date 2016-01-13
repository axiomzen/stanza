var React = require('react');

var StanzaActions = require('../actions/StanzaActions');

var Home = React.createClass({
  componentWillMount: function(){
    StanzaActions.toggleMenu(true);
  },
  render: function(){
    return null;
  }
});

module.exports = Home;