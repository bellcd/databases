var RoomsView = {

  $button: $('#rooms button'),
  $select: $('#rooms select'),
  roomList: ['All'],
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

    Rooms.getRooms();
    Rooms.add('All');
  },

  // TODO: there's likely a cleaner / more straighforward way to handle rendering all the rooms from the db
  render: function(roomName) {
    this.roomList.push(roomName);
    $('#rooms select option[selected]').removeAttr('selected');
    $('#rooms select').append(`<option value="${roomName}" selected>${roomName}</option>`);
    this.selectRoom(roomName);
  },

  renderAll: function(rooms) {
    this.roomList = rooms.map((room) => room.roomname);

    $('#rooms select').html('');
    this.roomList.forEach((roomName) => {
      $('#rooms select').append(`<option value="${roomName}">${roomName}</option>`);
    });

    this.selectRoom(this.roomList[0]);
  },

  selectRoom: function(room) {
    this.currentlySelected = room;
    $('#get-only-one-room button span').text(room);
    $('#rooms select option[selected]').removeAttr('selected');
    $(`#rooms select option[value="${room}"]`).prop('selected', true);
  }

};