var React = require('react');

var StanzaStore = require('../stores/StanzaStore');
var StanzaActions = require('../actions/StanzaActions');

var Sidebar = require('./Sidebar');
var Body = require('./Body');

var Playlist = React.createClass({
  getInitialState: function(){
    return StanzaStore.getState();
  },
  componentWillMount: function(){
    StanzaStore.addChangeListener(this._onChange);
    this.updatePlaylist();
  },
  componentWillUnmount: function() {
    StanzaStore.removeChangeListener(this._onChange);
  },
  componentDidUpdate: function(prevProps, prevState){
    if (prevProps.params.emotion != this.props.params.emotion) {
      this.updatePlaylist();
    }
  },
  updatePlaylist: function(){
    StanzaActions.toggleMenu(false);
    StanzaActions.updateEmotion(this.props.params.emotion);
    StanzaActions.loadPlaylist(this.props.params.emotion);
  },
  renderPlaylist: function(){
    var poem = StanzaStore.getCurrentPoem();
    return (
      <div className="inner">
        <Sidebar poem={poem} emotion={this.props.params.emotion} currentIndex={this.state.currentIndex} playlist={this.state.playlist} />
        <Body text={poem.body} />
      </div>
    );
  },
  render: function(){
    if (this.state.playlist.length){
      return this.renderPlaylist();
    } else {
      return (<div></div>);
    } 
  },
  _onChange: function() {
    this.setState(StanzaStore.getState());
  }
});

module.exports = Playlist;