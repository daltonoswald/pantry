import Header from '../../components/header/Header';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import doughImg from '../../assets/temp-stock-photos/dough.jpg'
import './login-signup.css'

export default function Signup() {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    // document.title = 'Pantry - Sign Up'

    useEffect(() => {
        if (localStorage.getItem('pantryAuthToken')) {
            navigate('/')
        }
    })

    const handleSubmit = async (event) => {
        event.preventDefault();
        const url = `http://localhost:3000/user/sign-up`;
        const signupData = {
            name: event.target.name.value,
            username: event.target.username.value,
            email: event.target.email.value,
            password: event.target.password.value,
            confirm_password: event.target.confirm_password.value,
            bio: event.target.bio.value,
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
                mode: "cors",
            });
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                setMessage(data.message);
                navigate('/login')
            } else {
                console.error("Error requesting authentication:", data.message);
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error requesting authentication:', error)
            setMessage(error)
        }
    }

    return (
        <div className='app'>
            <Header />
            <div className='signup-container'>
                <div className='signup-column-left'>
                    <img className='signup-image' src={doughImg} />
                </div>
                <div className='signup-column-right'>
                    <form className='signup-form' onSubmit={handleSubmit}>
                        <h3 className='signup-brand'>Pantry</h3>
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
                            <label htmlFor='email' className='form-label'>E-Mail</label>
                            <input 
                                type='text'
                                id='email'
                                name='email'
                                placeholder='example@email.com'
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='name' className='form-label'>Full Name</label>
                            <input  
                                type='text'
                                id='id'
                                name='name'
                                className='form-input'
                                placeholder='Full Name'
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
                            <label htmlFor='confirm_password' className='form-label'>Confirm Password</label>
                            <input
                                type='password'
                                id='confirm_password'
                                name='confirm_password'
                                minLength={8}
                                className='form-input'
                                required />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='bio' className='form-label'>Bio</label>
                            <textarea
                                id='bio'
                                name='bio'
                                className='form-input'
                                rows={5}
                                cols={40} />
                        </div>
                        <div className='form-group'>
                            <button className='submit-button' type='submit'>Sign up</button>
                        </div>
                        <p className='sign-up-login-link'>New to Pantry? <Link to='/login'>Log in</Link></p>
                    </form>
                </div>
            </div>
                        {/* {message && (
                            <Alert className='w-50 m-3 p-3 mx-auto' variant='danger'>{message}</Alert>
                        )} */}
        </div>
    )
}