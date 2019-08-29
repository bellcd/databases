// TODO: adds things here
var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),
  roomList: ['all'],

  initialize: function() {
    $('#rooms button').click(() => {
      this.addRoom.call(this);
    });

    this.$select.on('change', () => {
      let selectedRoom = $('#rooms select').val();
      let $allMessages = $('#chats');

      $allMessages.children().each(function() {
        let messageRoom = this.children[2].innerHTML;
        MessagesView.showOrHideMessage(this, messageRoom, selectedRoom);
      });
    });
  },

  addRoom: function() {
    let room = $('#roomname-input-field')[0].value;
    this.render(room);
    $('#roomname-input-field').eq(0).html('');
  },

  render: function(roomName) {
    this.roomList.push(roomName);
    $('#rooms select').append(`<option value="${roomName}">${roomName}</option>`);
  }

};
