var MessagesView = {

  $chats: $('#chats'),

  initialize: function() {

  },

  render: function(data) {
    // removes everything that's currently inside $chats
    $('#chats').empty();
    // iterate through data array
    for (let i = 0; i < data.length; i++) {
      // populate roomsview with names from the last 100 messages
      if (!RoomsView.roomList.includes(data[i].roomname) && data[i].roomname && data[i].roomname !== 'undefined') {
        // RoomsView.roomList.push(data[i].roomname);
        // create an <option> node from it, and append that node to the DOM
        RoomsView.render(data[i].roomname);
      }
      // call render() , passing in the relevant properties of each object
      let messageEquals = MessageView.render({username: data[i].User.username, text: data[i].text, roomname: data[i].Room.roomname});

      // append escaped user input
      let $messageEquals = $(messageEquals); // TODO: adds show or hide functionality

      // attach click handler on for socializing feature
      $messageEquals.click(function(e) {
        let element = $(e.target);
        if (element.hasClass('username')) {
          // get the username in question
          // add / remove it to the username list
          Friends.toggleStatus(element.text());
        }
      });
      MessagesView.showOrHideMessage($messageEquals, data[i].roomname, $('#rooms select').val());
      $('#chats').append($messageEquals);
    }
  },

  showOrHideMessage(messageElement, roomName, selectedRoom) {
    if (selectedRoom === 'All' || roomName === selectedRoom) {
      $(messageElement).show();
    } else {
      $(messageElement).hide();
    }
  }

};