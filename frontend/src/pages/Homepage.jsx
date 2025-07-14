import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div>
      <Nav />
      <h1>Test</h1>
      <button onClick={() => navigate('zerrdz')}>To the error page!</button>
    </div>
  )
}
