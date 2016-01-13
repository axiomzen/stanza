var React = require('react');
var fetch = require('node-fetch');

var StanzaStore = require('../stores/StanzaStore');

var Sidebar = require('./Sidebar');
var Body = require('./Body');
var Menu = require('./Menu');

var App = React.createClass({
  getInitialState: function(){
    return {
      menuActive: StanzaStore.isMenuActive(),
      emotion: StanzaStore.getEmotion()
    };
  },
  componentWillMount: function(){
    StanzaStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    StanzaStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <main className={this.state.emotion ? this.state.emotion.replace('+', '-') : null}>
        <Menu visible={this.state.menuActive} />
        {this.props.children}
      </main>
    );
  },
  _onChange: function() {
    this.setState({ 
      menuActive: StanzaStore.isMenuActive(),
      emotion: StanzaStore.getEmotion()
    });
  }
});

module.exports = App;