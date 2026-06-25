import { useEffect, useState } from 'react'
import './Home.css'
import api from '../utils/axios'
import usePlayerStore from '../store/playerstore'
import formatTime from '../utils/formatTime'
function Home() {
    const [history, setHistory] = useState(null)
    const { track, setTrack, current, isPause, setIsPause } = usePlayerStore();
    useEffect(() => {
        const fetchHistory = async (e) => {
            try {
                const response = await api.get('profile/history')
                setHistory(response.data)
                console.log(response.data)
            }
            catch (error) {
                console.error(error)
            }
        }

        fetchHistory()
    }, [])
    function handleSetTrack(e) {
        if (track?.id === e.id) {
            setIsPause(!isPause)
        }
        else {
            setTrack({ id:e.id,url: e.url, name: e.name, authors: e.authors, cover: e.cover });
        }
    }
    return (
        <main className='home'>
            <section className='recomendation'>
                <h2>Рекомендации</h2>
                <ul>
                    <li>
                        <img src='/rapp2 600x600.jpg' ya-no-select='true' />
                        <p className='name'>Rapp2</p>
                        <p className='authors'>Boulevard Depo</p>
                    </li>
                    <li>
                        <img src='/sweet dreams 600x600.jpg' ya-no-select='true' />
                        <p className='name'>Sweet Dreams</p>
                        <p className='authors'>Boulevard Depo</p>
                    </li>
                </ul>
            </section>
            <section className='history'>
                <h2>История</h2>
                {history&&(<ul>
                    {history.map((trackItem) => (
                        <li className={track?.id === trackItem.id ? 'active' : ''} onClick={()=>handleSetTrack({
                                        id:trackItem.id,
                                        url: trackItem.path,
                                        name:trackItem.name,
                                        authors:(trackItem.album.artists.map((artist) => (artist.name))+ ' ft. '+ trackItem.artists.map((artist) => (artist.name))),
                                        cover: trackItem.cover 
                                    })}>
                            <img src={trackItem.cover} alt="" className='cover'/>
                            <div className='meta'>
                                <p className='name'>{trackItem.name}</p>
                                <p className='authors'>{trackItem.album.artists.map((artist) => (artist.name))} ft. {trackItem.artists.map((artist)=>(artist.name))}</p>
                            </div>
                            <p className='time'>{track?.id === trackItem.id ? formatTime(current) : '9:00'}</p>
                        </li>
                    ))}
                </ul>)}
                {!history&&(<ul className='loading'>
                    {[...Array(5)].map(()=>(
                        <li>
                            <div className='cover'></div>
                            <div className='meta'>
                                <p className='name'></p>
                                <p className='authors'></p>
                            </div>
                            <p className='time'></p>
                        </li>
                    ))}
                </ul>)}
            </section>
        </main>
    )
}
export default Home