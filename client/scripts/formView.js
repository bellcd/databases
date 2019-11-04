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
    let roomValue = $('#rooms select').val(); // TODO: grabs the selected roomname when the submit button is pressed
    // Stop the browser from submitting the form
    event.preventDefault();

<<<<<<< HEAD
    // console.log(usernameValue);
=======
    console.log(usernameValue);
>>>>>>> solution

    // get values from form fields
    var message = {
      username: usernameValue,
      text: messageValue,
      roomname: roomValue
    };

<<<<<<< HEAD
    // console.log(message);

    Parse.create(message, (data) => {
      // console.log('data POSTed successfully.');
    });

    // console.log('click!');
=======
    console.log(message);

    Parse.create(message, (data) => {
      console.log('data POSTed successfully.');
    });

    console.log('click!');
>>>>>>> solution

    // reset messageField to blank
  },

  setStatus: function(active) {
    var status = active ? 'true' : null;
    FormView.$form.find('input[type=submit]').attr('disabled', status);
  }

};