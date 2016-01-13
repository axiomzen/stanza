var React = require('react');

var Body = React.createClass({
  render: function(){
    return (<div className='body'><p>{this.props.text}</p></div>);
  }
});

module.exports = Body;