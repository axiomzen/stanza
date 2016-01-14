var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var StanzaConstants = require('../constants/StanzaConstants');
var assign = require('object-assign');
var fetch = require('node-fetch');

var CHANGE_EVENT = 'change';

var _playlist = [];
var _currentIndex = 0;
var _emotion = null;
var _menuActive = false;

function fetchPlaylist(emotion) {
  return fetch(StanzaConstants.apiRoutes.PLAYLIST + emotion)
  .then(function(res) {
      return res.json();
  });
}

function setPlaylist(playlist) {
  _playlist = playlist;
}

function setEmotion(emotion) {
  _emotion = emotion;
}

function setMenuActive(menuActive) {
  _menuActive = menuActive;
}

function nextPoem(){
  if (_currentIndex == _playlist.length - 1) {
    return;
  }
  _currentIndex += 1;
}

function previousPoem(){
  if (_currentIndex == 0) {
    return;
  }
  _currentIndex -= 1;
}

function setIndex(poemIndex){
  _currentIndex = poemIndex;
}

var StanzaStore = assign({}, EventEmitter.prototype, {

  getEmotion: function() {
    return _emotion;
  }, 

  getPlaylist: function() {
    return _playlist;
  },

  getCurrentPoem: function() {
    return _playlist[_currentIndex];
  },

  isMenuActive: function() {
    return _menuActive;
  },

  getState: function(){
    return {
      playlist: _playlist,
      currentIndex: _currentIndex,
      emotion: _emotion
    }
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

AppDispatcher.register(function(action) {
  switch(action.actionType) {
    case StanzaConstants.actionTypes.PLAYLIST_LOAD:
      fetchPlaylist(action.emotion).then(function(playlist){
        setPlaylist(playlist);
        setIndex(0);
        StanzaStore.emitChange();
      });
      break;
    case StanzaConstants.actionTypes.PLAYLIST_NEXT_POEM:
      nextPoem();
      StanzaStore.emitChange();
      break;
    case StanzaConstants.actionTypes.PLAYLIST_PREVIOUS_POEM:
      previousPoem();
      StanzaStore.emitChange();
      break;
    case StanzaConstants.actionTypes.PLAYLIST_SELECT_POEM:
      setIndex(action.poemIndex);
      StanzaStore.emitChange();
      break;
    case StanzaConstants.actionTypes.EMOTION_UPDATE:
      setEmotion(action.emotion);
      StanzaStore.emitChange();
      break;
    case StanzaConstants.actionTypes.MENU_TOGGLE:
      setMenuActive(action.menuActive);
      StanzaStore.emitChange();
      break;
    default:
      // no op
  }
});

module.exports = StanzaStore;