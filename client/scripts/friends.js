var Friends = {
  friendsList: [],

  updateFriendsList: function(friendName) {
    // search friendsList for friendName
    let index = this.friendsList.indexOf(friendName);
    if (index !== -1) {
      // found,
        // remove from friendsList
        this.friendsList.splice(index, 1);
        // turn styling OFF for each message from that friend
        $('#chats').find('.username').each(function() {
          if ($(this).text() === friendName) {
            $(this).next().css({'font-weight': 'normal'});
          }
        });
    } else {
      // not found
        // add to friendsList
        this.friendsList.push(friendName);
        // turn styling ON
        $('#chats').find('.username').each(function() {
          if ($(this).text() === friendName) {
            $(this).next().css({'font-weight': 'bold'});
          }
        });
    }
    // re-render the <ul> in #friends
    $('#friends ul').html('');
    this.friendsList.forEach((friendName) => {
      $('#friends ul').append(`<li>${friendName}</li>`);
    });

  }
};