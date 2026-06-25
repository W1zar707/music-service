import axios from "axios"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from 'react-router-dom'
import './registration.css'
import api from "../../utils/axios"
function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password_confirm: ''
    })
    const navigate = useNavigate()
    const [usernameErrors, setUsernameErrors] = useState({message:null,status:null})
    const [emailErrors, setEmailErrors] = useState({message:null,status:null})
    const [passwordErrors, setPasswordErrors] = useState({message:null,status:null})
    const [passwordConfirmErrors, setPasswordConfirmErrors] = useState({message:null,status:null})
    const [showPassword,setShowPassword] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('registration', formData);
            navigate('/')
            
            console.log('Успешная регистрация:', response.data);
        } catch (error) {
            if (error.response.data.username) {
                    setUsernameErrors(error.response.data.username)
                    lastUsername.current = formData.username
                }
                if (error.response.data.email) {
                    setEmailErrors(error.response.data.email)
                    lastEmail.current = formData.email
                }
                if(error.response.data.password){
                    setPasswordErrors(error.response.data.password[0])
                    lastPassword.current = formData.password
                }
                if(error.response.data.password_confirm){
                    setPasswordConfirmErrors(error.response.data.password_confirm)
                    
                }
            console.error('Ошибка при регистрации:', error);
        }
    }

    const handleChange = (e) => {
        if(e.target.name ==='username'&&e.target.value===''){
            setUsernameErrors({...usernameErrors,status:null})
        }
        else if(e.target.name ==='email'&&e.target.value===''){
            setEmailErrors({...emailErrors,status:null})
        }
        else if(e.target.name ==='password'&&e.target.value===''){
            setPasswordErrors({...passwordErrors,status:null})
        }
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
                setUsernameErrors({...usernameErrors,status:'success'})
                lastUsername.current = e.target.value
            }
            else if(e.target.name === 'email'){
                setEmailErrors({...emailErrors,status:'success'})
                lastEmail.current = e.target.value
            }
            else if(e.target.name === 'password'){
                setPasswordErrors({...passwordErrors,status:'success'})
                lastPassword.current = e.target.value
            }
        }
        catch (error) {
            console.log('ошибка')
            if (error.response.data.username) {
                setUsernameErrors({message:error.response.data.username[0],status:'error'})
                lastUsername.current = e.target.value
            }
            else if (error.response.data.email) {
                setEmailErrors({message:error.response.data.email[0],status:'error'})
                lastEmail.current = e.target.value
            }
            else if(error.response.data.password){
                setPasswordErrors({message:error.response.data.password[0],status:'error'})
                lastPassword.current = e.target.value
            }
        }
    }
    return (
        <form className="registration" onSubmit={handleSubmit} noValidate>
            <div className="field">
                <label htmlFor="username">Логин</label>
                <div className={`field-bar ${usernameErrors.status===null? '' :usernameErrors.status==='success'?'success':'error'}`}>
                    <i className="ti ti-user"></i>
                    <input type="text" name="username" id="username" onChange={handleChange} onBlur={handleBlur} required />
                </div>
                <div className="field-message error">{usernameErrors.status==='error'&&(<><i className="ti ti-exclamation-circle"/> <span>{usernameErrors.message}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="email">Почта</label>
                <div className={`field-bar ${emailErrors.status===null? '' :emailErrors.status==='success'?'success':'error'}`}>
                    <i className="ti ti-mail"></i>
                    <input type="text" name="email" id="email" onChange={handleChange} onBlur={handleBlur} required />
                </div>
                <div className="field-message error">{emailErrors.status==='error'&&(<><i className="ti ti-exclamation-circle"/> <span>{emailErrors.message}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="password">Пароль</label>
                <div className={`field-bar ${passwordErrors.status===null? '' :passwordErrors.status==='success'?'success':'error'}`}>
                    <i className="ti ti-lock"></i>
                    <input type={showPassword ? 'text' : 'password'} name="password" id="password" onChange={handleChange} onBlur={handleBlur} required />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)}>
                        <i className={showPassword?"ti ti-eye-off":"ti ti-eye"}></i>
                    </button>
                </div>
                <div className="field-message error">{passwordErrors.status==='error'&&(<><i className="ti ti-exclamation-circle"/> <span>{passwordErrors.message}</span></>)}</div>
            </div>

            <div className="field">
                <label htmlFor="password_confirm">Повторите пароль</label>
                <div className="field-bar">
                    <i className="ti ti-lock"></i>
                    <input type={showPassword ? 'text' : 'password'} name="password_confirm" id="password_confirm" onChange={handleChange} required />
                </div>
                <div className="field-message error">{passwordConfirmErrors.status==='error'&&(<><i className="ti ti-exclamation-circle"/> <span>{passwordConfirmErrors.message}</span></>)}</div>
            </div>

            <button type="submit">Создать аккаунт</button>
        </form>
    )
}
export default Registration