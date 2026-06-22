import './Search.css'
import usePlayerStore from '../store/playerstore'
import formatTime from '../utils/formatTime';
function Search() {
    const { track, setTrack, current, isPause, setIsPause } = usePlayerStore();
    function handleSetTrack(e) {
        if (track?.url === e.url) {
            setIsPause(!isPause)
        }
        else {
            setTrack({ url: e.url, name: e.name, authors: e.authors, cover: e.cover });
        }
    }
    return (
        <main className='search'>
            <div className='search-header'>
                <div className="search-bar">
                    <button>
                        <i className="ti ti-search"></i>
                    </button>
                    <input type="text" />
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
                <section className='best-result'>
                    <h3>Лучший результат</h3>
                    <section className='artist'>
                        <img src="/boulevard depo orig.png" alt="" className='cover' />
                        <section>
                            <h2>Boulevard Depo</h2>
                            <ul className='albums'>
                                <li>
                                    <img src="/rare gods vol 1 600x600.jpg" alt="" />
                                </li>
                                <li>
                                    <img src="/sweet dreams 600x600.jpg" alt="" />
                                </li>
                                <li>
                                    <img src="/rapp2 600x600.jpg" alt="" />
                                </li>
                                <li>
                                    <img src="СЕРТОЛОВСКИЙ ТОКСИК 600x600.jpg" alt="" />
                                </li>
                            </ul>
                        </section>
                    </section>
                    <section className='album'>
                        <img src="/rare gods vol 1 600x600.jpg" alt="" className='cover' />
                        <section>
                            <div className='meta'>
                                <h2>Rare Gods Vol.1</h2>
                                <p>Boulevard Depo, i61</p>
                            </div>
                            <ul>
                                <li>
                                    <div className='title'>
                                        <p className='name'>Rare Death</p>
                                        {/* <p className='authors'></p> */}
                                    </div>
                                    <p className='time'>9:00</p>
                                </li>
                                <li>
                                    <div className='title'>
                                        <p className='name'>Rare Woman No Cry</p>
                                        <p className='authors'>awd</p>
                                    </div>
                                    <p className='time'>9:00</p>
                                </li>
                                <li>
                                    <div className='title'>
                                        <p className='name'>Rare Kaaviilxraava Oo / Rare Clean</p>
                                        <p className='authors'></p>
                                    </div>
                                    <p className='time'>9:00</p>
                                </li>
                                <li>
                                    <div className='title'>
                                        <p className='name'>Rare Tribal Cabin</p>
                                        <p className='authors'>awd</p>
                                    </div>
                                    <p className='time'>9:00</p>
                                </li>
                                <li>
                                    <div className='title'>
                                        <p className='name'>Rare Moscow Snow</p>
                                        <p className='authors'></p>
                                    </div>
                                    <p className='time'>9:00</p>
                                </li>
                            </ul>
                        </section>
                    </section>
                </section>
                <section className='tracks'>
                    <h3>Треки</h3>
                    <article className={'track' + (track?.url === '/Rare Death.mp3' ? ' active' : '')} onClick={() => handleSetTrack({ url: '/Rare Death.mp3', name: 'Rare Death', authors: 'Boulevard Depo, i61', cover: '/rare gods vol 1 600x600.jpg' })}>
                        <img src='/rare gods vol 1 600x600.jpg'></img>
                        <div className='title'>
                            <p className='name'>Rare Death</p>
                            <p className='authors'>Boulevard Depo, i61</p>
                        </div>
                        <p className='time'>{track?.url === '/Rare Death.mp3' ? formatTime(current) : '9:00'}</p>
                    </article>
                    <article className={'track' + (track?.url === '/BROTHA BROTHA.mp3' ? ' active' : '')} onClick={() => handleSetTrack({ url: '/BROTHA BROTHA.mp3', name: 'Brotha Brotha', authors: 'Saluki, Boulevard Depo', cover: '/wild east 600x600.jpg' })}>
                        <img src='/wild east 600x600.jpg'></img>
                        <div className='title'>
                            <p className='name'>Brotha Brotha</p>
                            <p className='authors'>Saluki, Boulevard Depo</p>
                        </div>
                        <p className='time'>{track?.url === '/BROTHA BROTHA.mp3' ? formatTime(current) : '9:00'}</p>
                    </article>
                </section>
                <div className='albums'></div>
                <section className='artists'>
                    <h3>Артисты</h3>
                    <ul>
                        <li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li><li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li><li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li><li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li><li>
                            <article className='artist'>
                                <img src='/boulevard depo orig.png' aria-hidden='true'></img>
                                <p className='name'>Boulevard Depo</p>
                            </article>
                        </li>
                        <li>
                            <article className='artist'>
                                <img src='/saluki orig.png' aria-hidden='true'></img>
                                <p className='name'>Saluki</p>
                            </article>
                        </li>
                    </ul>
                </section>


            </div>
        </main>
    )
}
export default Search