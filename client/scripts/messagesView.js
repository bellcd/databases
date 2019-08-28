var MessagesView = {

  $chats: $('#chats'),

  initialize: function() {

  },

  render: function(data, breakpointBoolean) {
    // iterate through data array
    for (let i = 0; i < data.results.length; i++) {
      // call render() , passing in the relevant properties of each object
      let messageEquals = MessageView.render(
        {username: data.results[i].username, text: data.results[i].text, roomname: data.results[i].roomname}
      );

      // debugger;
      console.log('render respone', messageEquals);

      // append escaped user input 
      $('#chats').append(messageEquals);
    }
  }

};