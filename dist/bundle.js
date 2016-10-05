(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1]);
