const startCamera = () => (
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })// eslint-disable-line
);
module.exports = startCamera;
