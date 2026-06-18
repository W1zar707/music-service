import { NavLink } from 'react-router-dom'
import './Navbar.css'
function Navbar(){
    return(
        <nav>
            <div className="title">
                <img src="/favicon.svg" alt='waves'></img>
                <p>Waves</p>
            </div>
            <div className="tabs">
                <NavLink to="/" aria-label="Домой">
                    <i className="ti ti-home" aria-hidden='true'></i>
                    <span>Главная</span>
                </NavLink>
                <NavLink to="/search" aria-label="Поиск">
                    <i className="ti ti-search" aria-hidden='true'></i>
                    <span>Поиск</span>
                </NavLink>
                <NavLink to="/profile" aria-label="Моя медиатека">
                    <i className="ti ti-list" aria-hidden='true'></i>
                    <span>Моя медиатека</span>
                </NavLink>
            </div>
            <div className="playlists">
                <h4>Плейлисты</h4>
                <ul>
                    <li>
                        <p>Понравившиеся</p>
                    </li>
                    <li>
                        <p>Летний плейлист</p>
                    </li>
                    <li>
                        <p>Рабочий фокус</p>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
export default Navbar