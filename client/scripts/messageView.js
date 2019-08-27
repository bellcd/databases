var MessageView = {

  render: _.template(`
      <div class="chat">
        <div class="username"><%= username %></div>
        <div><%= message %></div>
        <div><%= roomname %></div>
      </div>
    `)

};