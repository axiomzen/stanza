var React = require('react');

var Menu = React.createClass({
	chooseEmotion: function(emotion, event){
		event.preventDefault();
		this.props.chooseEmotion(emotion.toLowerCase());
	},
	render: function(){

		var emotions = this.props.emotions.map(function(emotion, i){
			return (
				<li className='genre-list-item'>
					<h2><a href={'/playlist/' + emotion} onClick={this.chooseEmotion.bind(this, emotion)}>{emotion}</a></h2>
				</li>
			);
		}.bind(this));

		return (
			<div id='menu'>
				<div className='genre-title'>
					<h3>GENRES AND MOODS</h3>
				</div>
				<ul className='genre-list-container'>{emotions}</ul>
			</div>
		);

	}
});

module.exports = Menu;