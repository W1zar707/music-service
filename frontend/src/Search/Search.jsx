import './Search.css'
function Search() {
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
                <section className='tracks'>
                    <h3>Треки</h3>
                    <article className='track'>
                        <img src='/600x600.jpg'></img>
                        <div className='title'>
                            <p className='name'>Rare Death</p>
                            <p className='authors'>Boulevard Depo, i61</p>
                        </div>
                        <p className='duration'>9:00</p>
                    </article>
                </section>
                <div className='albums'></div>
                <section className='artists'>
                    <h3>Артисты</h3>
                    <article className='artist'>
                        <img src='/boulevard depo orig.png'></img>
                        <p className='name'>Boulevard Depo</p>
                    </article>
                    <article className='artist'>
                        <img src='/saluki orig.png'></img>
                        <p className='name'>Saluki</p>
                    </article>
                </section>


            </div>
        </main>
    )
}
export default Search