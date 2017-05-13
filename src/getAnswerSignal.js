const Peer = require('simple-peer');
const playMyStream = require('./playMyStream');
const playFriendStream = require('./playFriendStream');

const getAnswerSignal = (stream, socket, callerSignal) => (
    new Promise((resolve) => {
        playMyStream(stream);
        const p = new Peer({
            initiator: false,
            trickle: false,
            stream
        });
        p.signal(callerSignal);
        p.on('stream', stream2 => playFriendStream(stream2));
        p.on('signal', myData => resolve(myData));
    })
);

module.exports = getAnswerSignal;
