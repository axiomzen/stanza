var React = require('react');
var fetch = require('node-fetch');

var Sidebar = require('./Sidebar');
var Body = require('./Body');
var Menu = require('./Menu');

var routes = {
	playlist: 'http://localhost:3000/poems/'
};

var menu = document.getElementById('menu');

var App = React.createClass({
	getInitialState: function(){
		return {
			emotion: this.props.emotion,
			showMenu: this.props.showMenu,
			current: 0,
			playlist: null
		};
	},
	componentDidMount: function(){
		this.updatePlaylist();
	},
	updatePlaylist: function(){
		fetch(routes.playlist + this.state.emotion)
	    .then(function(res) {
	        return res.json();
	    }).then(this.setPlaylist);
	},
	setPlaylist: function(data){
		this.setState({ playlist: data, current: 0 });
	},
	getCurrent: function(){
		return this.state.playlist[this.state.current];
	},
	next: function(){
		if (this.state.current == this.state.playlist.length - 1) {
			return;
		}
		this.setState({ current: this.state.current + 1 });
	},
	prev: function(){
		if (this.state.current == 0) {
			return;
		}
		this.setState({ current: this.state.current - 1 });
	},
	chooseEmotion: function(emotion){
		this.setState({ emotion: emotion, showMenu: false}, function(){
			this.updatePlaylist();
		}.bind(this));
	},
	showMenu: function(){
		this.setState({ showMenu: true });
	},
	renderPlaylist: function(){
		var menu = (<Menu chooseEmotion={this.chooseEmotion} emotions={this.props.emotions} />);
		var poem = this.getCurrent();
		return (
			<div className="inner">
				{this.state.showMenu ? menu : null}
				<Sidebar showMenu={this.showMenu} emotion={this.state.emotion} current={this.state.current} playlist={this.state.playlist} poem={poem} next={this.next} prev={this.prev} />
				<Body text={poem.body} />	
			</div>	
			);
	},
	render: function(){
		return (
				<main className={this.state.playlist ? 'active' : ''}>{this.state.playlist ? this.renderPlaylist() : null}</main>
			);
	}
});

module.exports = App;