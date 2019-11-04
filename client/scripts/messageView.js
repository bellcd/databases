var MessageView = {
  render: _.template(`
      <div class="chat">
        <div class="username"><%- username %></div>
        <div class="user-message"><%- text %></div>
        <div class="roomname"><%- roomname %></div>
        </div>
        `)
};