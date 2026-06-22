import { useEffect, useRef, useState } from "react"
import usePlayerStore from "../store/playerstore";
import './Player.css'
import formatTime from "../utils/formatTime";
function Player() {
    const audio = useRef();
    const [duration, setDuration] = useState(0);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0);

    const { track, isPause, current, setIsPause, setCurrent } = usePlayerStore()

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

    useEffect(() => {
        audio.current.src = track.url;
    }, [track])
    
    useEffect(()=>{
        if(isPause){
            audio.current.pause();
        }
        else{
            audio.current.play();
        }
    },[isPause])

    function handleLoadedMetadata() {
        if (navigator.userActivation.hasBeenActive) {
            audio.current.play()
        }
        setDuration(Math.floor(audio.current.duration));
        setVolume(audio.current.volume * 100);
    }
    function handleProgressChange(e) {
        setCurrent(Math.floor(duration / 100 * e.target.value));
        setProgress(e.target.value);
        audio.current.currentTime = Math.floor(duration / 100 * e.target.value);
    }
    function handlePause(e) {
        setIsPause(!isPause);
    }
    function handleVolume(e) {
        setVolume(e.target.value);
        audio.current.volume = e.target.value / 100;
    }
    function handleTimeUpdate(e) {
        if (audio.current.readyState < 2) return
        const currentTime = Math.floor(audio.current.currentTime);
        setCurrent(currentTime);
        const percent = duration / 100;
        setProgress(Math.floor(currentTime / percent));
    }
    return (
        <div className="player">
            <audio ref={audio}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate} />
            <div className="metadata">
                <img className="cover" src={track.cover} alt={`Обложка ${track.name}`} />
                <div className="title-metadata">
                    <p className="name">{track.name}</p>
                    <p className="authors">{track.authors}</p>
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