var AppDispatcher = require('../dispatcher/AppDispatcher');
var StanzaConstants = require('../constants/StanzaConstants');

var StanzaActions = {

  loadPlaylist: function(emotion) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.PLAYLIST_LOAD,
      emotion: emotion
    });
  },

  nextPoem: function(){
    AppDispatcher.dispatch({
      actionType: StanzaConstants.PLAYLIST_NEXT
    });
  },

  previousPoem: function(){
    AppDispatcher.dispatch({
      actionType: StanzaConstants.PLAYLIST_PREVIOUS
    });
  },

  updateEmotion: function(emotion) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.EMOTION_UPDATE,
      emotion: emotion
    });
  },

  toggleMenu: function(menuActive) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.MENU_TOGGLE,
      menuActive: menuActive
    });
  }

};

module.exports = StanzaActions;