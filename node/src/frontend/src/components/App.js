var React = require('react');
var fetch = require('node-fetch');

var Sidebar = require('./Sidebar');
var Body = require('./Body');

var routes = {
	playlist: 'http://localhost:3000/poems/'
};

var App = React.createClass({
	getInitialState: function(){
		return {
			current: 0,
			playlist: null
		};
	},
	componentDidMount: function(){
		fetch(routes.playlist + 'anger')
	    .then(function(res) {
	        return res.json();
	    }).then(this.setPlaylist);
	},
	setPlaylist: function(data){
		this.setState({ playlist: data });
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
	render: function(){
		if(this.state.playlist){
			var poem = this.getCurrent();
			return (
				<main className="active">
					<Sidebar current={this.state.current} playlist={this.state.playlist} poem={poem} next={this.next} prev={this.prev} />
					<Body text={poem.body} />
				</main>
				);
		} else {
			return (<main></main>);
		}
	}
});

module.exports = App;