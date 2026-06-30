import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { userService } from '../services/user'
import { login, signup } from '../store/actions/user.actions'
import { ImgUploader } from '../cmps/ImgUploader'

export function LoginSignupModal({ isOpen, onClose }) {
    const [isLoginView, setIsLoginView] = useState(true)

    if (!isOpen) return null

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>×</button>
                
                <nav className="modal-login-content">
                    <button 
                        className={isLoginView ? 'active' : ''} 
                        onClick={() => setIsLoginView(true)}
                    >
                        Login
                    </button>
                    <button 
                        className={!isLoginView ? 'active' : ''} 
                        onClick={() => setIsLoginView(false)}
                    >
                        Signup
                    </button>
                </nav>

                {isLoginView ? (
                    <Login onSuccess={onClose} />
                ) : (
                    <Signup onSuccess={onClose} />
                )}
            </div>
        </div>
    )
}

function Login({ onSuccess }) {
    const [credentials, setCredentials] = useState({ username: '', password: '' })
    const navigate = useNavigate()

    async function onLogin(ev) {
        if (ev) ev.preventDefault()
        if (!credentials.username) return
        
        await login(credentials)
        onSuccess()
        navigate('/')
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form className="login-form" onSubmit={onLogin}>
            <h2>Login</h2>
            <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
    )
}

function Signup({ onSuccess }) {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    async function onSignup(ev) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return
        
        await signup(credentials)
        onSuccess()
        navigate('/')
    }

    function onUploaded(imgUrl) {
        setCredentials(prev => ({ ...prev, imgUrl }))
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <h2>Create Account</h2>
            <input type="text" name="fullname" value={credentials.fullname} placeholder="Fullname" onChange={handleChange} required />
            <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} required />
            <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} required />
            <ImgUploader onUploaded={onUploaded} />
            <button type="submit">Signup</button>
        </form>
    )
}