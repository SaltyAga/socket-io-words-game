var express = require('express');
var socket = require('socket.io');
var Typo = require("typo-js");
var dictionary = new Typo( "en_US" );

//App setup
var app = express();

var server = app.listen(process.env.PORT || 3000, () => {
    console.log("Web server running");
  });

//static files
app.use(express.static('public'));
 

//Socket setup
var io = socket(server);

//creating an array to store all the words of one game
var wordsArr = [];

io.on ('connection', (socket) => {
    console.log('made socket connection', socket.id);
    socket.on('disconnect', () => {
        wordsArr = [];
    })
    socket.on('game', (data) => {
        
        if (typeof data.word != 'undefined') {
            if (dictionary.check(data.word)) {
                if (wordsArr.indexOf(data.word) === -1) {
                    wordsArr.push(data.word);
                    io.sockets.emit('game', data);
                } else {
                    data.warning = 'This word has been already in use';
                    io.sockets.emit('game', data);
                } 
            } else {
                data.warning = 'Check the spelling';
                io.sockets.emit('game', data);
            }
        } else {
            data.warning = 'Uncorrect word';
            io.sockets.emit('game', data);
        };    
    });

    socket.on('typing', data => {
        socket.broadcast.emit('typing', data);
    })
});