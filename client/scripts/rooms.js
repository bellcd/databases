var Rooms = {
  add: function() {
    let roomName = $('#rooms input').val();
    if (roomName === '') { return; }

    Parse.addRoom(() => {
      RoomsView.render(roomName);
    }, null, roomName);
    $('#rooms input').val('');
  },

  getRooms: function() {
    Parse.getRooms((rooms) => { // TODO: jQuery's ajax() success callback's don't use error first callback style??
      if (Object.keys(rooms).length === 0) {
        rooms = [{ roomname: 'All' }];
      }
      RoomsView.renderAll(rooms);
    });
  }
};