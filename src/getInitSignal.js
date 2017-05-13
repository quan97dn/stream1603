const Peer = require('simple-peer');
const playFriendStream = require('./playFriendStream');

const getInitSignal = (stream, socket) => (
    new Promise((resolve) => {
        const p = new Peer({
            initiator: true,
            trickle: false,
            stream
        });
        p.on('signal', data => resolve(data));
        socket.on('RECEIVE_ACCEPTION', data => p.signal(data));
        p.on('stream', stream2 => playFriendStream(stream2));
    })
);

module.exports = getInitSignal;
