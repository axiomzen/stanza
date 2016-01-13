var React = require('react');
var Link = require('react-router').Link;

var Menu = React.createClass({
	chooseEmotion: function(emotion, event){
		event.preventDefault();
		this.props.chooseEmotion(emotion.toLowerCase());
	},
	render: function(){

		var emotions = this.props.emotions.map(function(emotion, i){
			return (
				<li className='genre-list-item' key={i}>
					<h2><Link to={'/playlist/' + emotion}>{emotion}</Link></h2>
				</li>
			);
		}.bind(this));

		return (
			<div id='menu' className={this.props.visible ? 'active' : ''}>
				<div className='genre-title'>
					<h3>GENRES AND MOODS</h3>
				</div>
				<ul className='genre-list-container'>{emotions}</ul>
			</div>
		);

	}
});

module.exports = Menu;