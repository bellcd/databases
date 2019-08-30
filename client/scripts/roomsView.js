// TODO: adds things here
var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),
  roomList: ['all'],
  currentlySelected: '',

  initialize: function() {
    $('#rooms button').click(() => {
      Rooms.add.call(this);
    });

    this.$select.on('change', () => {
      this.currentlySelected = $('#rooms select').val();
      let $allMessages = $('#chats');

      $('#get-only-one-room button span').text(this.currentlySelected);

    $allMessages.children().each(function() {
      let messageRoom = this.children[2].innerHTML;
      MessagesView.showOrHideMessage(this, messageRoom, RoomsView.currentlySelected);
      });
    });
  },

  render: function(roomName) {
    this.roomList.push(roomName);
    $('#rooms select').append(`<option value="${roomName}">${roomName}</option>`);
  }

};
