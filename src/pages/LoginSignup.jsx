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
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    async function onLogin(ev) {
        if (ev) ev.preventDefault()
        if (!credentials.username) return

        setErrMsg('')
        try {
            await login(credentials)
            onSuccess()
            navigate('/')
        } catch (err) {
            setErrMsg('Wrong username or password')
        }
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form className="login-form" onSubmit={onLogin}>
            <h2>Login</h2>
            <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} autoComplete="username" required />

            {/* autoComplete tells the browser this is an existing password —
                stops Chrome logging the typed value in a console warning */}
            <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} autoComplete="current-password" required />

            {/* only rendered when a login attempt failed */}
            {errMsg && <p className="auth-error">{errMsg}</p>}

            <button type="submit">Login</button>

        </form>
    )
}


function Signup({ onSuccess }) {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    function handleChange(ev) {
        const { name, value } = ev.target
        setCredentials(prev => ({ ...prev, [name]: value }))
    }

    async function onSignup(ev) {
        if (ev) ev.preventDefault()
        if (!credentials.username || !credentials.password || !credentials.fullname) return

        setErrMsg('')
        try {
            await signup(credentials)
            onSuccess()
            navigate('/')
        } catch (err) {
            const serverMsg = err.response?.data?.err
            setErrMsg(serverMsg || 'Could not create account. Try a different username.')
        }
    }

    function onUploaded(imgUrl) {
        setCredentials(prev => ({ ...prev, imgUrl }))
    }

    return (
        <form className="signup-form" onSubmit={onSignup}>
            <h2>Create Account</h2>
            <input type="text" name="fullname" value={credentials.fullname} placeholder="Fullname" onChange={handleChange} autoComplete="name" required />
            <input type="text" name="username" value={credentials.username} placeholder="Username" onChange={handleChange} autoComplete="username" required />

            {/* new-password: tells the browser this is a fresh account,
                not a saved login — also stops the console value warning */}
            <input type="password" name="password" value={credentials.password} placeholder="Password" onChange={handleChange} autoComplete="new-password" required />

            <ImgUploader onUploaded={onUploaded} />

            {/* shows the backend's reason, e.g. "Username already taken" */}
            {errMsg && <p className="auth-error">{errMsg}</p>}

            <button type="submit">Signup</button>

        </form>
    )
}