import Header from '../../components/header/Header';
import Alert from '../../components/modals/Alert';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import vegetablesImg from '../../assets/temp-stock-photos/vegetables.jpg'
import './login-signup.css'

export default function Login() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const token = localStorage.getItem('pantryAuthToken')

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/log-in`
        const loginData = {
            username: event.target.username.value,
            password: event.target.password.value
        }
        console.log('data:', loginData)
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                localStorage.setItem('pantryAuthToken', data.token);
                localStorage.setItem('pantryUsername', data.user.username);
                navigate('/')
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message)
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error requesting authentication:', error)
            console.log(error)
        }
    }

    return (
        <div className='app'>
            <Header />
            <div className='login-container'>
                <div className='login-column-left'>
                    <img className='login-image' src={vegetablesImg} />
                </div>
                <div className='login-column-right'>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <h3 className='login-brand'>Welcome Back</h3>
                        <div className='form-group'>
                            <label htmlFor='username' className='form-label'>Username</label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                placeholder='Username'
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                minLength={8}
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <button className='submit-button' type='submit'>Log in</button>
                        </div>
                        
                        {message && (
                        <Alert message={message} />
                        )}

                        <p className='sign-up-login-link'>New to Pantry? <Link to='/sign-up'>Sign up</Link></p>
                    </form>
                </div>
            </div>
        </div>
    )
}