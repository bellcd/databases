var MessagesView = {

  $chats: $('#chats'),

  initialize: function() {

  },

  render: function(data, breakpointBoolean) {
    // TODO: matches the format returned by the server for when we're testing a single object message
    if (!data.results) {
      data = {
        results: [
          data
        ]
      };
    }

    // removes everything that's currently inside $chats
    $('#chats').empty();

    // iterate through data array
    for (let i = 0; i < data.results.length; i++) {

      // call render() , passing in the relevant properties of each object
      let messageEquals = MessageView.render(
        {username: data.results[i].username, text: data.results[i].text, roomname: data.results[i].roomname}
      );

      console.log('render respone', messageEquals);

      // append escaped user input
      let $messageEquals = $(messageEquals); // TODO: adds show or hide functionality
      MessagesView.showOrHideMessage($messageEquals, data.results[i].roomname, $('#rooms select').val())
      $('#chats').append($messageEquals);
    }
  },

  showOrHideMessage(messageElement, roomName, selectedRoom) {
    if (selectedRoom === 'all' || roomName === selectedRoom) {
      $(messageElement).show();
    } else {
      $(messageElement).hide();
    }
  }

};