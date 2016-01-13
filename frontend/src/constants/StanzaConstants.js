var keyMirror = require('keymirror');

module.exports = {
  apiRoutes: {
    PLAYLIST: 'http://codex-stanza.herokuapp.com/poems/'
  },
  actionTypes: keyMirror({
    PLAYLIST_LOAD: null,
    PLAYLIST_NEXT: null,
    PLAYLIST_PREVIOUS: null,
    EMOTION_UPDATE: null,
    MENU_TOGGLE: null
  })
};