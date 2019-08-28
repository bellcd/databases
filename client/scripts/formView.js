var FormView = {

  $form: $('form'),
  $messageField: undefined,

  initialize: function() {
    FormView.$form.on('submit', FormView.handleSubmit);
    FormView.$messageField = $('#message');
  },

  handleSubmit: function(event) {
    let messageValue = $('#message')[0].value;
    let usernameValue = window.location.search.slice(10);
    let roomValue = $('#roomname')[0].value; // TODO: add roomname functionality
    // Stop the browser from submitting the form
    event.preventDefault();

    console.log(usernameValue);

    // get values from form fields
    var message = {
      username: usernameValue,
      text: messageValue,
      roomname: '4chan'
    };

    console.log(message);
    
    Parse.create(message, (data) => {
      console.log('data POSTed successfully.');
    });
    
    console.log('click!');

    // reset messageField to blank
  },

  setStatus: function(active) {
    var status = active ? 'true' : null;
    FormView.$form.find('input[type=submit]').attr('disabled', status);
  }

};