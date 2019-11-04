
var Rooms = {
  add: function(roomname) {
    roomname = roomname ? roomname : roomname = $('#rooms input').val();
    if (roomname === '') { return; }

    Parse.addRoom(() => {
      RoomsView.render(roomname);
    }, null, roomname);
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