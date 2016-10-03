var socket = io.connect('http://localhost:3004');

(function() {
  console.log('Socket is opened...')

  var insertMessage = function(newMessage) {
    $("#message-list").append("<li>"+newMessage+"</li>")
  }

  $('#chat_form').submit(function(e){
    e.preventDefault()
    var message = $('#chat_input').val();
    socket.emit("messages", message)
    //insertMessage(message)
    $('#chat_input').val("");
  })

  socket.on("messages", function(data) {
    insertMessage(data)
  });

  socket.on('connect', function(nickname) {
    $('#status').html('Connected to Chattr')
    nickname = prompt("What is your nickname?")
    socket.emit('join', nickname)
    $("#user-list").append("<li>"+nickname+"</li>")
  })
  socket.on('disconnect', function (socket) {
    var m = "user"
    socket.emit("leave_channel", m )
  });
})()
