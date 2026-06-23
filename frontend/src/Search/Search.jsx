import './Search.css'
import usePlayerStore from '../store/playerstore'
import formatTime from '../utils/formatTime';
import { useEffect, useState } from 'react';
import api from '../utils/axios'
function Search() {
    const { track, setTrack, current, isPause, setIsPause } = usePlayerStore();
    const [suggest, setSuggest] = useState('');
    const [query, setQuery] = useState('');
    const [best_result, setBestResult] = useState(null)
    const [tracks, setTracks] = useState(null)
    const [artists, setArtists] = useState(null)
    function handleSetTrack(e) {
        if (track?.id === e.id) {
            setIsPause(!isPause)
        }
        else {
            setTrack({ id:e.id,url: e.url, name: e.name, authors: e.authors, cover: e.cover });
        }
    }
    useEffect(() => {
        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            try {
                const { data } = await api.post(
                    '/search',
                    { search: query },
                    { signal: controller.signal }
                );
                setArtists(data.artists)
                setTracks(data.tracks)
                setBestResult(data.best_result)
                console.log('best_Result:')
                console.log(data.best_result)
                console.log('tracks:')
                console.log(data.tracks)
                console.log('artists:')
                console.log(data.artists)
            }
            catch (error) {
                console.error('Ошибка:', error);
            }
        }, 500);
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [query])
    return (
        <main className='search'>
            <div className='search-header'>
                <div className="search-bar">
                    <button>
                        <i className="ti ti-search"></i>
                    </button>
                    <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button aria-label="Искать">
                        <i className="ti ti-x"></i>
                    </button>
                </div>
                <div className='search-filters'>
                    <button>
                        <span>Всё</span>
                    </button>
                    <button>
                        <span>Треки</span>
                    </button>
                    <button>
                        <span>Артисты</span>
                    </button>
                    <button>
                        <span>Альбомы</span>
                    </button>
                </div>
            </div>
            <div className='search-result'>
                {best_result && (<section className='best-result'>
                    <h3>Лучший результат</h3>
                    {best_result.index_name === 'artist' && (<section className='artist'>
                        <img src={best_result.cover} alt="" className='cover' />
                        <section>
                            <h2>{best_result.name}</h2>
                            <ul className='albums'>
                                {best_result.albums.map((album, index) => (
                                    <li key={album.id} style={{ animationDelay: `${index * 0.15}s` }}>
                                        <img src={album.cover} alt="" />
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </section>)}
                    {best_result.index_name === 'album' && (<section className='album'>
                        <img src={best_result.cover} alt="" className='cover' />
                        <section>
                            <div className='meta'>
                                <h2>{best_result.name}</h2>
                                <p>{best_result.artists.map((artist) => (artist.name))}</p>
                            </div>
                            <ul>
                                {best_result.tracks.map((trackItem,index) => (
                                    <li key={trackItem.id} style={{animationDelay: `${index*0.15}s`}} className={track?.id === trackItem.id ? 'active' : ''} onClick={()=>handleSetTrack({
                                        id:trackItem.id,
                                        url: trackItem.path,
                                        name:trackItem.name,
                                        authors:(best_result.artists.map((artist) => (artist.name))+ ' ft. '+ trackItem.artists.map((artist) => (artist.name))),
                                        cover: best_result.cover 
                                    })}>
                                        <p className='order'>{trackItem.order}</p>
                                        <div className='title'>
                                            <p className='name'>{trackItem.name}</p>
                                            <p className='authors'>{trackItem.artists && trackItem.artists.length > 0 && (<>{'ft.'} {trackItem.artists.map((artist) => (artist.name))}</>)}</p>
                                        </div>
                                        <p className='time'>{track?.id === trackItem.id ? formatTime(current) : '9:00'}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </section>)}
                </section>)}
                {tracks && tracks.length > 0 && (<section className='tracks'>
                    <h3>Треки</h3>
                    {tracks.map((trackItem) => (
                        <article key={trackItem.id} className={`track ${track?.id === trackItem.id ? 'active' : ''}`} onClick={() => handleSetTrack({
                            id: trackItem.id,
                            url: trackItem.path,
                            name: trackItem.name,
                            authors: (trackItem.album.artists.map((artist) => (artist.name))+ ' ft. '+ trackItem.artists.map((artist) => (artist.name))),
                            cover: trackItem.cover 
                            })}>
                    <img src={trackItem.cover}></img>
                    <div className='title'>
                        <p className='name'>{trackItem.name}</p>
                        <p className='authors'>{trackItem.album.artists.map((artist) => (artist.name))} ft. {trackItem.artists.map((artist) => (artist.name))}</p>
                    </div>
                    <p className='time'>{track?.id === trackItem.id ? formatTime(current) : '9:00'}</p>
                </article>
                ))}
            </section>)}
            <div className='albums'></div>
            {artists && artists.length > 0 && (<section className='artists'>
                <h3>Артисты</h3>
                <ul>
                    {artists.map((artist) => (
                        <li>
                            <article className='artist'>
                                <img src={artist.cover} alt="" />
                                <p className='name'>{artist.name}</p>
                            </article>
                        </li>
                    ))}
                </ul>
            </section>)}


        </div>
        </main >
    )
}
export default Search