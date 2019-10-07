// TODO: renames RoomsView.addRoom to Rooms.add and moves it here
var Rooms = {
  add: function() {
    let roomName = $('#rooms input').val();
    Parse.addRoom(() => {
      RoomsView.render(roomName);
    }, null, roomName);
    $('#rooms input').html('');
  },
};