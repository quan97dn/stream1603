const playMyFriendStream = (stream) => {
    const video = document.querySelectorAll('video')[1];// eslint-disable-line
    video.src = window.URL.createObjectURL(stream);// eslint-disable-line
    video.play();
};

module.exports = playMyFriendStream;
