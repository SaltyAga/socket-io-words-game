

//Make connection
var socket = io.connect();

//query DOM
var output = document.getElementById('output'),
    namePlayer = document.getElementById('player-name'),
    word = document.getElementById('word'),
    btn = document.getElementById('send'),
    feedback = document.getElementById('feedback'),
    timer = document.getElementById('timer'),
    socketId = document.getElementById('socket-id'),
    gameOver = document.getElementById('game-over'),
    btnPlayAgain = document.getElementById('play-again'),
    lastLetter = document.getElementById('last-letter');




//scroll down
// var element = document.getElementById("game-window");
// element.scrollTop = element.scrollHeight;

function updateScroll() {
    var element = document.getElementById("game-window");
    element.scrollTop = element.scrollHeight;
    console.log(element.scrollTop);
};


//timer function
var interval = 0;
function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    clearInterval(interval);
    //interval = 0;
    interval = setInterval(function () {
        seconds = parseInt(timer % 60, 10);

        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = seconds + ' seconds left';

        if (--timer < -1) {
            gameOver.style.display = 'block';
            updateScroll();
            display.textContent = 'Time';
            clearInterval(interval);
        }
    }, 1000);
};

//play again event
btnPlayAgain.addEventListener('click', () => {
    location.reload();
})

//Emit event
btn.addEventListener('click', () => {
    updateScroll();
    if (socket.id == socketId.value && typeof socketId.value == 'undefined') {
        word.disabled = true;
    } else {
        word.disabled = false;
        if (typeof lastLetter.value != 'undefined') {
            if (lastLetter.value == word.value[0]) {
                socket.emit('game', {
                    word: word.value,
                    name: namePlayer.value,
                    lastLetter: word.value[word.value.length - 1],
                    socketId: socket.id
                });
            } else {
                socket.emit('game', {
                    warning: 'Uncorrect word'
                });
            };
        } else {
            socket.emit('game', {
                word: word.value,
                name: namePlayer.value,
                lastLetter: word.value[word.value.length - 1],
                socketId: socket.id
            });
        };
        word.value = '';
        
}});
//Emit event
word.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        btn.click();
    }
});

word.addEventListener('keypress', () => {
    socket.emit('typing', namePlayer.value);
});
//Listen for event
socket.on('game', (data) => {
    
    if (typeof data.warning != 'undefined') {
        feedback.innerHTML = data.warning;
    } else {
        lastLetter.value = data.lastLetter;
        feedback.innerHTML = "";
        output.innerHTML += '<p><strong>' + 
            data.name + ':</strong> ' + data.word +
            '</p>';
        word.value = "";
    };
    console.log(feedback.innerHTML);
    if (feedback.innerHTML == '') {
        var duration = 10,
            display = document.querySelector('#timer');
        startTimer(duration, display);
    };
});

socket.on('typing', data => {
    feedback.innerHTML = '<p><em>' + data + 
        ' is typing a word...</em></p>'
})

