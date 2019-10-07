var Parse = {

  // server: `http://parse.${window.CAMPUS}.hackreactor.com/chatterbox/classes/messages`,
  server: 'http://127.0.0.1:3000/classes',

  create: function(message, successCB, errorCB = null) {
    // todo: save a message to the server
    $.ajax({
      url: `${Parse.server}/messages`,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to send message', error);
      }
    });
  },

  readAll: function(successCB, errorCB = null) {
    $.ajax({
      url: `${Parse.server}/messages`,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  // TODO: verify that this works??
  readOnlySomeRooms: function(successCB, errorCB = null, roomName) {
    $.ajax({
      url: `http://parse.${window.CAMPUS}.hackreactor.com/chatterbox/classes/messages?where={"roomname":"${roomName}"}`,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: successCB,
      error: errorCB || function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  }

};