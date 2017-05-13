const $ = require('jquery');
const io = require('socket.io-client');
const Peer = require('simple-peer');
const startCamera = require('./startCamera');
const playMyStream = require('./playMyStream');

$('document').ready(() => {
    const socket = io();
    $('#divChat').hide();

    $('#btnSignUp').click(() => {
        const username = $('#txtUsername').val();
        socket.emit('DANG_KY_USERNAME', username);
    });

    $('#ulUser').on('click', 'li', function () {
        const dest = $(this).text();
        //make call
        startCamera()
        .then(stream => {
            playMyStream(stream);
            const p = new Peer({
                initiator: true,
                trickle: false,
                stream
            });
            p.on('signal', data => {
                socket.emit('NEW_CALL_SIGNAL', { dest, data });
            });
        })
        .catch(err => console.log(err));
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
        .then(stream => {
            playMyStream(stream);
            const p = new Peer({
                initiator: false,
                trickle: false,
                stream
            });
            p.signal(data);
            p.on('signal', myData => {
                socket.emit('ACCEPT_SIGNAL', { idSender, data: myData });
            });
        })
        .catch(err => console.log(err));
    });
});

//https://socket.io/docs/emit-cheatsheet/
