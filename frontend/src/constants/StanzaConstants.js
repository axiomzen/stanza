var keyMirror = require('keymirror');

var config = require('../config/production');
//var config = require('../config/local');

module.exports = {
  apiRoutes: {
    PLAYLIST: config.API_URL + 'poems/'
  },
  actionTypes: keyMirror({
    PLAYLIST_LOAD: null,
    PLAYLIST_NEXT_POEM: null,
    PLAYLIST_PREVIOUS_POEM: null,
    PLAYLIST_SELECT_POEM: null,
    EMOTION_UPDATE: null,
    MENU_TOGGLE: null
  })
};