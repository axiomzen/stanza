var React = require('react');
var StanzaActions = require('../actions/StanzaActions');

var AudioPlayer = require('./AudioPlayer');

var Sidebar = React.createClass({
  getInitialState: function(){
    return {
      showPlaylist: false
    };
  },
  togglePlaylist: function(){
    this.setState({ showPlaylist: !this.state.showPlaylist });
  },
  selectPoem: function(poemIndex){
    StanzaActions.selectPoem(poemIndex);
    this.togglePlaylist();
  },
  renderPlaylist: function(){
    var poems = this.props.playlist.map(function(poem, i){
      return (<li className={this.props.currentIndex == i ? 'active' : ''} key={i} onClick={this.selectPoem.bind(this, i)}><strong>{poem.title}</strong> {poem.poet}</li>);
    }.bind(this));
    return (<div className={"playlist" + (this.state.showPlaylist ? ' active' : '')}><ul>{poems}</ul></div>);
  },
  showMenu: function(){
    StanzaActions.toggleMenu(true);
  },
  render: function(){
    return (
      <div className="sidebar">
        <div className="chosen-genre">
          <span onClick={this.showMenu}>{this.props.emotion}</span>
        </div>
        {this.renderPlaylist()}
        <div className="inner">
          <div className={"meta" + (this.state.showPlaylist ? ' hide' : '')}>
            <h2 className="poem-title">{this.props.poem.title}</h2>
            <div className="poem-author"><span className='author-name'>{'By ' + this.props.poem.poet}</span></div>
          </div>
          <AudioPlayer showPlaylist={this.state.showPlaylist} togglePlaylist={this.togglePlaylist} playlist={this.props.playlist} currentIndex={this.props.currentIndex} poem={this.props.poem} />
        </div>
      </div>
    );
  }
});

module.exports = Sidebar;