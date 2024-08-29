import './App.css';
import React from 'react';
import axios from "axios"
import{ useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';

const api = axios.create({
  baseURL:"http://localhost:3001"
})

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSignup = async(e)=>{
  e.preventDefault()
  try{
    await api.post("/signup",{email,password})
  alert('Signup successful');
  setEmail('');
  setPassword('');
  }catch (error) {
    console.error('Error during login:', error);
    alert('Login failed');
  }

}
return (
  <div className="container">
  <form onSubmit={handleSignup}>
    <h2>Signup</h2>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type='submit'>Signup</button>
      </form>
      </div>
    )
  }

  const Login = () => {
    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')

    const handleLogin = async(e) =>{
      e.preventDefault()
      try{
        await api.post("/login",{email,password})
      alert('Login successful');
      setEmail('');
      setPassword('');
      }catch (error) {
        console.error('Error during login:', error);
        alert('Login failed');
      }
    }

    return(
      <div className="container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input type='text' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit'>Login</button>
        </form>
        </div>
    )
  }
  const HomePage = () => {
    const navigate = useNavigate();
  
    const handleSignupClick = () => {
      navigate('/login');
    };
  
    const handleLoginClick = () => {
      navigate('/signup');
    };
  
    return (
      <div className="homepage-container">
        <h1>Welcome to Our App</h1>
        <button className="home-button" onClick={handleSignupClick}>
          Login
        </button>
        <button className="home-button" onClick={handleLoginClick}>
          Signup
        </button>
      </div>
    );
  }
const App = () => {
  return (

      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>

  );
}

export default App;
