var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// add data base to persist data on the client side
/**
 * redis-server install http://jasdeep.ca/2012/05/installing-redis-on-mac-os-x/
 *
 * documentation: http://redis.io/documentation
 * config: http://redis.io/topics/config
 *
 * start redis server/DB: redis-server
 *
 */

var redis = require('redis');
var redisClient = redis.createClient();

/**
 * log level
 *
 * npm run env
 * npm config list
 */

// console.log('redisClient: ', redisClient)

// persists data with a messages store
var messages = []
var pseudos = []

var storeMessage = function(name, message) {
  // stringify messages to add the redis DB
  var message = JSON.stringify({ name: name, message: message })

  redisClient.lpush('messages', message, function(err, response) {
    // keep the newest 10 items
    redisClient.ltrim("messages", 0, 9)
    console.log('DB ->' + response +', ' + message)
  })

  // messages.push({ name: name, message: message })
  // if (messages.length > 10) {
  //   // more than 10 messages, the first one gets removed
  //   messages.shift()
  // }
}
var uiIDts = new Date().getTime()
var storeUsers = function(userName) {
  pseudos.push({ uID: uiIDts, userName: userName })
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
    console.log(pseudo +' has connected on the server, socket.id is: ' + client.id )

    client.broadcast.emit("user_connected", pseudo)
    storeUsers(nickname)
    var loggedUsers = pseudos.map(function(u) {
      return u.userName
    })
    console.log('loggedUsers: ', loggedUsers)

    // retrieving all the messages from the DB
    redisClient.lrange("messages", 0, -1, function(err, messages) {
      // reverse messages to be emitted in the correct order.. lpush...
      messages = messages.reverse()
      // emits all the message to the client who just joined
      messages.forEach(function(message) {
        // parse stringyfied object from redis DB
        message = JSON.parse(message)
        client.emit('messages', message.name + ": " + message.message)
      })

    })


    pseudos.forEach(function(data) {
      client.emit('user_connected', data.userName)
    })

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

  client.on('disconnect', function() {
    console.log(pseudo +' has disconnected from the server!, socket.id is: '+ client.id)
    // reassigns the  new mutated array without leaver to the pseudos array
    pseudos = pseudos.filter(function(p) {
      return (p.userName !== pseudo)
    })
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
