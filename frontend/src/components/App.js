var React = require('react');
var fetch = require('node-fetch');

var Sidebar = require('./Sidebar');
var Body = require('./Body');

var routes = {
	playlist: 'http://localhost:3000/poems'
};

var App = React.createClass({
	getInitialState: function(){
		return {
			current: 0,
			playlist: null
		};
	},
	componentDidMount: function(){
		fetch(routes.playlist)
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
		this.setState({ current: this.state.current + 1 });
	},
	prev: function(){
		this.setState({ current: this.state.current - 1 });
	},
	render: function(){
		if(this.state.playlist){
			var poem = this.getCurrent();
			return (
				<main className="active">
					<Sidebar poem={poem} next={this.next} prev={this.prev} />
					<Body text={poem.body} />
				</main>
				);
		} else {
			return (<main></main>);
		}
	}
});

module.exports = App;