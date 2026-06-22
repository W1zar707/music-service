function formatTime(e) {
    e = Math.floor(e);
    return `${Math.floor(e / 60)}:${e % 60 >= 10 ? e % 60 : '0' + e % 60}`;
}

export default formatTime