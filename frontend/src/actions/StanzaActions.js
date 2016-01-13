var AppDispatcher = require('../dispatcher/AppDispatcher');
var StanzaConstants = require('../constants/StanzaConstants');

var StanzaActions = {

  loadPlaylist: function(emotion) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.PLAYLIST_LOAD,
      emotion: emotion
    });
  },

  nextPoem: function(){
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.PLAYLIST_NEXT_POEM
    });
  },

  previousPoem: function(){
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.PLAYLIST_PREVIOUS_POEM
    });
  },

  selectPoem: function(poemIndex){
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.PLAYLIST_SELECT_POEM,
      poemIndex: poemIndex
    });
  },

  updateEmotion: function(emotion) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.EMOTION_UPDATE,
      emotion: emotion
    });
  },

  toggleMenu: function(menuActive) {
    AppDispatcher.dispatch({
      actionType: StanzaConstants.actionTypes.MENU_TOGGLE,
      menuActive: menuActive
    });
  }

};

module.exports = StanzaActions;