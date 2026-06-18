import { useEffect, useRef, useState } from "react"
import './Player.css'
function Player() {
    const audio = useRef();
    const [cover, setCover] = useState('../public/600x600.jpg');
    const [name, setName] = useState('Rare Woman No Cry');
    const [authors, setAuthors] = useState('Boulevard Depo, i61');
    const [current, setCurrent] = useState(0);
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPause, setIsPause] = useState(true);
    const [volume, setVolume] = useState(0);
    useEffect(() => {
        audio.current.src = '/Rare Woman No Cry.mp3';
        navigator.mediaSession.setActionHandler('play', () => {
            audio.current.play()
            setIsPause(false)
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            audio.current.pause()
            setIsPause(true)
        })
    }, []);
    function formatTime(e) {
        e = Math.floor(e);
        return `${Math.floor(e / 60)}:${e % 60 >= 10 ? e % 60 : '0' + e % 60}`;
    }
    function handleLoadedMetadata() {
        setDuration(Math.floor(audio.current.duration));
        setVolume(audio.current.volume * 100);
    }
    function handleProgressChange(e) {
        setCurrent(Math.floor(duration / 100 * e.target.value));
        setProgress(e.target.value);
        console.log(Math.floor(duration / 100) * e.target.value);
        audio.current.currentTime = Math.floor(duration / 100 * e.target.value);
    }
    function handlePause(e) {
        if (isPause) {
            audio.current.play();
            setIsPause(false);
        }
        else {
            audio.current.pause();
            setIsPause(true);
        }
    }
    function handleVolume(e) {
        console.log(e.target.value)
        setVolume(e.target.value);
        audio.current.volume = e.target.value / 100;
    }
    function handleTimeUpdate(e) {
        const currentTime = Math.floor(audio.current.currentTime);
        setCurrent(currentTime);
        const percent = duration / 100;
        setProgress(Math.floor(currentTime / percent));
    }
    return (
        <div className="player">
            <audio ref={audio}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata} />
            <div className="metadata">
                <img className="cover" src={cover} alt={`Обложка ${name}`} />
                <div className="title-metadata">
                    <p className="name">{name}</p>
                    <p className="authors">{authors}</p>
                </div>
            </div>
            <div className="controls">
                <div className="buttons">
                    <button className="previous" aria-label="Предыдущий трек" >
                        <i className="ti ti-player-skip-back" aria-hidden="true" />
                    </button>
                    <button className="pause" aria-label="Пауза" onClick={handlePause}>
                        <i className={isPause ? "ti ti-player-play" : "ti ti-player-pause"} aria-hidden="true" />
                    </button>
                    <button className="next" aria-label="Следующий трек" >
                        <i className="ti ti-player-skip-forward" aria-hidden="true" />
                    </button>
                </div>
                <div className="progress">
                    <span>{formatTime(current)}</span>
                    <input type="range" min="0" max="100" value={progress} onChange={handleProgressChange} />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
            <div className="volume">
                <i className="ti ti-volume-2"></i>
                <input className="volume_bar" type="range" value={volume} min="0" max="100" onChange={handleVolume} />
            </div>
        </div>
    )
}
export default Player