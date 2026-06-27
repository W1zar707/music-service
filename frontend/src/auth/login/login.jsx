import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from "../../utils/axios";
function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('оле')
        try {
            const response = await api.post('login', formData);
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }
    const handleBlur = (e) => {

    }
    return (
        <form className="login" onSubmit={handleSubmit} noValidate>
            <input type="text" name="username" id="username" onChange={handleChange} onBlur={handleBlur} required />
            <input type={showPassword ? 'text' : 'password'} name="password" id="password" onChange={handleChange} onBlur={handleBlur} required />
            <button type="submit">Войти</button>
        </form>
    )
}
export default Login