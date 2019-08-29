// TODO: renames RoomsView.addRoom to Rooms.add and moves it here
var Rooms = {
  add: function() {
    let roomName = $('#rooms input').val();
    RoomsView.render(roomName);
    $('#rooms input').html('');
  },
};