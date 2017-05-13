const $ = require('jquery');
const io = require('socket.io-client');
const startCamera = require('./startCamera');
const playMyStream = require('./playMyStream');
const getInitSignal = require('./getInitSignal');
const getAnswerSignal = require('./getAnswerSignal');

$('document').ready(() => {
    const socket = io();
    $('#divChat').hide();

    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('DANG_KY_USERNAME', username);
    });

    $('#ulUser').on('click', 'li', function () {
        const dest = $(this).text();
        startCamera()
        .then(stream => {
            playMyStream(stream);
            return getInitSignal(stream, socket);
        })
        .then(data => socket.emit('NEW_CALL_SIGNAL', { dest, data }));
    });

    socket.on('XAC_NHAN_DANG_KY', arrUser => {
        if (arrUser) {
            arrUser.forEach(e => {
                $('#ulUser').append(`<li id="${e}">${e}</li>`);
            });
            socket.on('NGUOI_DUNG_MOI', username => {
                $('#ulUser').append(`<li id="${username}">${username}</li>`);
            });
            $('#divChat').show();
            return $('#divSignUp').hide();
        }
        alert('Username da ton tai!'); // eslint-disable-line
    });

    socket.on('NGUOI_DUNG_THOAT', username => {
        $(`#${username}`).remove();
    });

    socket.on('SOMEONE_CALL_YOU', signalData => {
        const { idSender, data } = signalData;
        startCamera()
        .then(stream => getAnswerSignal(stream, socket, data))
        .then(myData => socket.emit('ACCEPT_SIGNAL', { idSender, data: myData }));
    });
});

//https://socket.io/docs/emit-cheatsheet/
