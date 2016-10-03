var socket = io.connect('http://localhost:3004');

(function() {
  console.log('Socket is opened...')
  console.log(socket)

  var insertUser = function(newUser) {
    $("#").append("<li>" + newUser + "</li>")
  }

  var insertMessage = function(newMessage) {
    $("#message-list").append("<li>"+newMessage+"</li>")
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
    var nickname = window.nickname = prompt("What is your nickname?")
    socket.emit('join', nickname)
    insertUser(nickname)
  })
  socket.on('disconnect', function (window) {
    var leaver = window.nickname
    socket.emit("leave_channel", leaver)
  });
})()
