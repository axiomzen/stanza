var React = require('react');
var AudioPlayer = require('./AudioPlayer');

var Sidebar = React.createClass({
	render: function(){
		return (
			<div className="sidebar">
				{this.props.poem.title}
				<AudioPlayer next={this.props.next} poem={this.props.poem} />
			</div>
			);
	}
});

module.exports = Sidebar;