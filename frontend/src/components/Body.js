var React = require('react');

var Body = React.createClass({
	render: function(){
		return (<div className='body'>{this.props.text}</div>);
	}
});

module.exports = Body;