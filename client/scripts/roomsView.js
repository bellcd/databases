// TODO: adds things here
var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),
  roomList: [],

  initialize: function() {
    $('#rooms button').click(() => {
      this.addRoom.call(this);
    });
  },

  addRoom: function() {
    let room = $('#roomname-input-field')[0].value;
    this.render(room);
    $('#roomname-input-field')[0].html('');
  },

  render: function(roomName) {
    this.roomList.push(roomName);
    $('#rooms select').append(`<option value="${roomName}">${roomName}</option>`);
  }

};
