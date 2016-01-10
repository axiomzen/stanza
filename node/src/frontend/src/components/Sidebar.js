var React = require('react');
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
	renderPlaylist: function(){
		var poems = this.props.playlist.map(function(poem, i){
			return (<li className={this.props.current == i ? 'active' : ''} key={poem._id}><strong>{poem.title}</strong> {poem.poet}</li>);
		}.bind(this));
		return (<div className={"playlist" + (this.state.showPlaylist ? ' active' : '')}><ul>{poems}</ul></div>);
	},
	render: function(){
		return (
			<div className="sidebar">
				<div className="chosen-genre">
                    <span>ANTICIPATION</span>
                </div>
				{this.renderPlaylist()}
				<div className="inner">
					<div className={"meta" + (this.state.showPlaylist ? ' hide' : '')}>
						<h2 className="poem-title">{this.props.poem.title}</h2>
						<h4 className="poem-credit">{'By ' + this.props.poem.poet}</h4>
					</div>
					<AudioPlayer showPlaylist={this.state.showPlaylist} togglePlaylist={this.togglePlaylist} next={this.props.next} prev={this.props.prev} playlist={this.props.playlist} current={this.props.current} poem={this.props.poem} />
				</div>
			</div>
			);
	}
});

module.exports = Sidebar;