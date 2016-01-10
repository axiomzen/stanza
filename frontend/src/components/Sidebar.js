var React = require('react');
var AudioPlayer = require('./AudioPlayer');

var Sidebar = React.createClass({
	render: function(){
		return (
			<div className="sidebar">
				<div className="inner">
					<div className="meta">
						<h2 className="poem-title">{this.props.poem.title}</h2>
						<h4 className="poem-credit">{'By ' + this.props.poem.poet}</h4>
					</div>
					<AudioPlayer next={this.props.next} prev={this.props.prev} poem={this.props.poem} />
				</div>
			</div>
			);
	}
});

module.exports = Sidebar;