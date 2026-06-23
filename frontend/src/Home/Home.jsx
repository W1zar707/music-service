import './Home.css'
function Home(){
    return (
        <main className='home'>
            <section className='recomendation'>
                <h2>Рекомендации</h2>
                <ul>
                    <li>
                        <img src='/rapp2 600x600.jpg' ya-no-select='true'/>
                        <p className='name'>Rapp2</p>
                        <p className='authors'>Boulevard Depo</p>
                    </li>
                    <li>
                        <img src='/sweet dreams 600x600.jpg' ya-no-select='true'/>
                        <p className='name'>Sweet Dreams</p>
                        <p className='authors'>Boulevard Depo</p>
                    </li>
                </ul>
            </section>
            <section className='history'>
                <h2>История</h2>
                <ul>
                    <li>
                        <div className='meta'>
                            <p className='name'>Название</p>
                            <p className='authors'>Авторы</p>
                        </div>
                        <p className='time'>9:00</p>
                    </li>
                </ul>
            </section>
        </main>
    )
}
export default Home