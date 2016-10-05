var socket = io.connect('http://localhost:3004');

(function() {
  console.log('Socket is opened...')

  var insertUser = function(newUser) {
    $("#user-list").append("<li>" + newUser + "</li>")
  }

  var insertMessage = function(newMessage) {
    $("#message-list").append("<li>"+newMessage+"</li>")
  }

  var userJoined = function(newUser) {
    if(newUser) {
      $('#new_user').text(newUser + ' has joined the chat!')
    } else {
      console.log('User has joined the chat!')
    }
  }

  $('#chat_form').submit(function(e){
    e.preventDefault()
    var message = $('#chat_input').val();
    // messages init here
    socket.emit("messages", message)
    $('#chat_input').val("");
  })

  socket.on("messages", function(data) {
    insertMessage(data)
  });

  socket.on('connect', function(nickname) {
    $('#status').html('Connected to Chattr')
    // init here
    var nickname = window.nickname = prompt("What is your nickname?")
    socket.emit('join', nickname)
  })

  socket.on('user_connected', function(data) {
    console.log('user_connected data:', data)
    insertUser(data)
    userJoined(data)
  })

  socket.on('disconnect', function (window) {
    console.log("client disconnected from server")
  });
})()
