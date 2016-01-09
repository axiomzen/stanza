var React = require('react');

var AudioPlayer = React.createClass({	
	getInitialState: function(){
		return {
			playing: true,
		}
	},
	componentDidMount: function(){
		this.refs.player.play();
	},
	componentDidUpdate: function(prevProps, prevState){
		if(prevProps.poem._id !== this.props.poem._id){
			this.refs.player.load();
			this.refs.player.play();
			this.setState({ playing: true });			
		}
	},
	toggle: function(){
		if (this.state.playing){
			this.refs.player.pause();
		} else {
			this.refs.player.play();
		}
		
		this.setState({ playing: !this.state.playing});
	},
	next: function(){
		return this.props.next();
	},
	prev: function(){
		return this.props.prev();
	},
	render: function(){
		return (
			<div className='audio-player'>
				<audio ref='player'>
					  <source src={this.props.poem.audio} type="audio/mpeg" />
				</audio>
				<button onClick={this.prev}>prev</button>
				<button onClick={this.toggle}>{this.state.playing ? 'pause' : 'play'}</button>
				<button onClick={this.next}>next</button>
			</div>
			);
	}
});

module.exports = AudioPlayer;