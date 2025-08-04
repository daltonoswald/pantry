import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className='app'>
      <Header />
      <h1>Test</h1>
      <button onClick={() => navigate('zerrdz')}>To the error page!</button>
    </div>
  )
}
