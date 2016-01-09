var React = require('react');
var Sidebar = require('./Sidebar');
var Body = require('./Body');

var poem = {"_id":"birds-passing-night","body":"\nBirds Passing the Night\n\n\n\nIn the flight of the ruru\nvoices recalling the past\nshaping the future perhaps\nAncestors\nseating themselves at the window\nglad to be part of the talk\nthe reverence for night\nwhen wind blows us\nstories and rain is a song\ncaught in the remembering throat.\n\n","audio":"http://www.poetryarchive.org/files/poem_audio/Birds%20Passing%20The%20Night.mp3","title":"Birds Passing the Night","themes":[],"poet":"Riemke Ensing"};

var App = React.createClass({
	render: function(){
		return (
			<main>
				<Sidebar poem={poem} />
				<Body text={poem.body} />
			</main>
			);
	}
});

module.exports = App;