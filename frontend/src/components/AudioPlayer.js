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
	toggle: function(){
		if (this.state.playing){
			this.refs.player.pause();
		} else {
			this.refs.player.play();
		}
		
		this.setState({ playing: !this.state.playing});
	},
	render: function(){
		return (
			<div className='audio-player'>
				<audio ref='player'>
					  <source src={this.props.poem.audio} type="audio/mpeg" />
				</audio>
				<button onClick={this.toggle}>{this.state.playing ? 'pause' : 'play'}</button>
			</div>
			);
	}
});

module.exports = AudioPlayer;