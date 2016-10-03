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

  // creates a pseudo accessible in closures below
  var pseudo = 'Unknown'

  // shows usernames when people joins the chat
  client.on('join', function(nickname) {
    // sets a value for the nickname on the client side - available on client and server
    // reassigns nickname to pseudo var
    pseudo = nickname
    client.broadcast.emit("connect", pseudo)

  })

  // emits messages event on the client/browser sending the object
  client.on('messages', function(message) {
    // pseudo available in the closure above
    console.log(pseudo + ' says: ' + message)
      // server broadcast the messages to other clients connected when a message is received from a client
    client.broadcast.emit("messages", pseudo + ": " + message)
    //emits messages on the current message to render what we type - message back to our client
    client.emit("messages", pseudo + ": " + message)
    // message is stored in the message store
    storeMessage(pseudo, message);
  })

  client.on('leave_channel', function(leaver) {
    console.log(leaver +' user has disconnected!')
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
