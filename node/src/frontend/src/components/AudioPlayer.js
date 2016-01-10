var React = require('react');

var AudioPlayer = React.createClass({	
	getInitialState: function(){
		return {
			playing: true,
		}
	},
	componentDidMount: function(){
		this.refs.player.play();
    	this.interval = setInterval(this.tick, 250);
	},
	componentDidUpdate: function(prevProps, prevState){
		if(prevProps.poem._id !== this.props.poem._id){
			this.refs.player.load();
			this.refs.player.play();
			this.setState({ playing: true, progress: 0 });			
		}
	},
	tick: function() {
		if (this.refs.player.ended){
			this.next();
		}
    	this.setState({ progress: this.refs.player.currentTime / this.refs.player.duration });
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
	togglePlaylist: function(){
		return this.props.togglePlaylist();
	},
	render: function(){
		return (
			<div className='audio-player'>
				<audio ref='player'>
					  <source src={this.props.poem.audio} type="audio/mpeg" />
				</audio>
				<div className="controls">
					<div className={"skip-back button" + (this.props.current == 0 ? ' inactive' : '')} onClick={this.prev}></div>
					<div className={'play-pause button' + (!this.state.playing ? ' play' : '')}  onClick={this.toggle}></div>
					<div className={"skip-forward button" + (this.props.current == this.props.playlist.length - 1 ? ' inactive' : '')} onClick={this.next}></div>
					<div className={"playlist-button button " + (this.props.showPlaylist ? ' active' : '')} onClick={this.togglePlaylist}></div>
				</div>
				<div className="progress-bar">
                    <div className="marker" style={{ width: this.state.progress * 100 + '%'}}></div>
                </div>
			</div>
			);
	}
});

module.exports = AudioPlayer;