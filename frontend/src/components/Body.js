var React = require('react');

var Body = React.createClass({
  componentDidUpdate: function(prevProps, prevState){
    this.refs.body.scrollTop = 0;
  },
  render: function(){
    return (<div className='body' ref='body'><p>{this.props.text}</p></div>);
  }
});

module.exports = Body;