var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var redis = require('redis');
// var redisClient = redis.createClient();

// persists data with a messages store
var messages = []

var storeMessage = function(name, message) {
  messages.push({ name: name, message: message })
  if (messages.length > 10) {
    // more than 10 messages, the first one gets removed
    messages.shift()
  }
}

// listen to connection events and pass in client/socket
io.on('connection', function(client) {
  console.log('Client connected...')

  // shows usernames when people joins the chat
  client.on('join', function(nickname) {
    // sets a value for the nickname on the client side - available on client and server
    client.nickname = nickname
    console.log(nickname, 'has joined the channel!')
  })

  // emits messages event on the client/browser sending the object
  client.on('messages', function(data) {
    // gets client nickname befire broadcasting a message
    var message = data
    console.log('server - message:', message)
    var nickname = client.nickname
    console.log('server - nickname :', nickname)
      // server broadcast the messages to other clients connected when a message is received from a client
    client.broadcast.emit("messages", nickname + ": " + message)
    //emits messages on the current message to render what we type - message back to our client
    client.emit("messages", nickname + ": " + message)
    // message is stored in the message store
    storeMessage(nickname, message);
    console.log(storeMessage)
  })

  client.on('leave_channel', function(data, socket) {
    console.log(data,'has disconnected!')
  })
});

app.get('/', function(req, res) {
  // sends index page on router root
  res.sendFile(__dirname + '/dist/index.html');
})

// define dist as dir to server static files (css, js, etc..)
app.use(express.static('dist'));

server.listen(3004, function() {
  console.log('server running on port 3004')
})

//   redisClient.lrange("questions", 0, -1, function(err, questions) {
//     questions.forEach(function(question) {
//       client.emit("question", question);
//     });
//   });
//
//   client.on('answer', function(question, answer) {
//     client.broadcast.emit('answer', question, answer);
//   });
//
//   client.on('question', function(question) {
//     if(!client.question_asked) {
//       client.question_asked = true;
//       client.broadcast.emit('question', question);
//       redisClient.lpush("questions", question, function() {
//         redisClient.ltrim('questions', 0, 19)
//       });
//     }
//   });
