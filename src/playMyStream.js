const playMyStream = (stream) => {
    const video = document.querySelectorAll('video')[0];// eslint-disable-line
    video.src = window.URL.createObjectURL(stream);// eslint-disable-line
    video.play();
};

module.exports = playMyStream;
