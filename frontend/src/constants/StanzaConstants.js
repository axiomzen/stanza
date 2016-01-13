var keyMirror = require('keymirror');

var config = require('../config/production');
//var config = require('../config/local');

module.exports = {
  apiRoutes: {
    PLAYLIST: config.API_URL + 'poems/'
  },
  actionTypes: keyMirror({
    PLAYLIST_LOAD: null,
    PLAYLIST_NEXT: null,
    PLAYLIST_PREVIOUS: null,
    EMOTION_UPDATE: null,
    MENU_TOGGLE: null
  })
};