import { NavLink } from 'react-router-dom'
import './Navbar.css'
import { useEffect, useState } from 'react'
import api from '../utils/axios'
function Navbar(){
    const [username,setUsername] = useState('')
    const [avatar,setAvatar] = useState('/rare gods vol 1 600x600.jpg')
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        const fetchAccount = async (e) =>{
            const response = await api.get('profile')
            setUsername(response.data.username)
            setIsLoading(false)
        }
        fetchAccount()
    },[])
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
            <div className={`account ${isLoading?'loading':''}`} ><img src={avatar}/><span>{username}</span></div>
        </nav>
    )
}
export default Navbar