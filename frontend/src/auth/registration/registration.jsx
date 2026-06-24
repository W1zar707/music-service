import axios from "axios"
import { useEffect, useRef, useState } from "react"
import './registration.css'
import api from "../../utils/axios"
function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: ''
    })

    const [usernameErrors, setUsernameErrors] = useState(null)
    const [emailErrors, setEmailErrors] = useState(null)
    const [passwordErrors, setPasswordErrors] = useState(null)
    const [passwordConfirmErrors, setPasswordConfirmErrors] = useState(null)
    const [showPassword,setShowPassword] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('registration', formData);

            if (response.status == 400) {
                if (response.data.username) {
                    setUsernameErrors(response.data.username)
                    lastUsername.current = e.target.value
                }
                if (response.data.email) {
                    setEmailErrors(response.data.email)
                    lastEmail.current = e.target.value
                }
                if(response.data.password){
                    setPasswordErrors(response.data.password[0])
                }
                if(response.data.password_confirm){
                    setPasswordConfirmErrors(response.data.password_confirm)
                }
            }
            console.log('Успешная регистрация:', response.data);
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const lastUsername = useRef(null)
    const lastEmail = useRef(null)
    const lastPassword = useRef(null)

    const handleBlur = async (e) => {
        if (e.target.name === 'username' && e.target.value === lastUsername.current) {
            return
        }
        else if (e.target.name === 'email' && e.target.value === lastEmail.current) {
            return
        }
        else if (e.target.name === 'password' && e.target.value === lastPassword.current) {
            return
        }
        try {
            const response = await api.post(
                'validate',
                { [e.target.name]: e.target.value }
            )
            console.log(response)
            if(e.target.name === 'username'){
                setUsernameErrors(null)
                lastUsername.current = e.target.value
            }
            else if(e.target.name === 'email'){
                setEmailErrors(null)
                lastEmail.current = e.target.value
            }
            else if(e.target.name === 'password'){
                setPasswordErrors(null)
                lastPassword.current = e.target.value
            }
        }
        catch (error) {
            if (error.response.data.username) {
                setUsernameErrors(error.response.data.username)
                lastUsername.current = e.target.value
            }
            else if (error.response.data.email) {
                setEmailErrors(error.response.data.email)
                lastEmail.current = e.target.value
            }
            else if(error.response.data.password){
                setPasswordErrors(error.response.data.password[0])
                lastPassword.current = e.target.value
            }
        }
    }
    return (
        <form className="registration" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="username">Логин</label>
                <div className={`field-bar ${usernameErrors? 'error' : 'success'}`}>
                    <i className="ti ti-user"></i>
                    <input type="text" name="username" id="username" onChange={handleChange} onBlur={handleBlur} required />
                </div>
                <div className="field-message error">{usernameErrors&&(<><i className="ti ti-exclamation-circle"/> <span>{usernameErrors}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="email">Почта</label>
                <div className={`field-bar ${emailErrors? 'error' : ''}`}>
                    <i className="ti ti-mail"></i>
                    <input type="text" name="email" id="email" onChange={handleChange} onBlur={handleBlur} required />
                </div>
                <div className="field-message error">{emailErrors&&(<><i className="ti ti-exclamation-circle"/> <span>{emailErrors}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="password">Пароль</label>
                <div className={`field-bar ${passwordErrors? 'error' : ''}`}>
                    <i className="ti ti-lock"></i>
                    <input type={showPassword ? 'text' : 'password'} name="password" id="password" onChange={handleChange} onBlur={handleBlur} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}>
                        <i className={showPassword?"ti ti-eye-off":"ti ti-eye"}></i>
                    </button>
                </div>
                <div className="field-message error">{passwordErrors&&(<><i className="ti ti-exclamation-circle"/> <span>{passwordErrors}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="password_confirm">Повторите пароль</label>
                <div className="field-bar">
                    <i className="ti ti-lock"></i>
                    <input type={showPassword ? 'text' : 'password'} name="password_confirm" id="password_confirm" onChange={handleChange} required />
                </div>
                <div className="field-message error">{passwordConfirmErrors&&(<><i className="ti ti-exclamation-circle"/> <span>{passwordConfirmErrors}</span></>)}</div>
            </div>

            <button type="submit">Создать аккаунт</button>
        </form>
    )
}
export default Registration