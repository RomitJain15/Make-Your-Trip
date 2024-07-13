import { Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';

function Login() {

    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const navigate = useNavigate();
      
    const handleLoginSuccess = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      axios.post('https://make-your-trip-backend.onrender.com/api/login', {email, password})
      .then(response => {
        if(response.data.message === "Success") {
            localStorage.setItem('userName', response.data.user.name);
            localStorage.setItem('userId', response.data.user._id);
            localStorage.setItem('token', response.data.token);
            navigate('/', { state: { isLoggedIn: true } });
        } else if(response.data.message === "Incorrect Password") {
            alert('Incorrect Password')
        } else {
            alert('User not found')
        }
      })
      .catch(error => alert('Login Failed! ', error));
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100" 
        style={{
            backgroundImage: 'url("https://c02.purpledshub.com/uploads/sites/48/2023/02/why-sky-blue-2db86ae.jpg?w=1029&webp=1")', 
            backgroundSize: 'cover', // Cover the entire page
            backgroundPosition: 'center', // Center the background image
            backgroundRepeat: 'no-repeat', // Do not repeat the image
          }}
          > 
            <div className="bg-white p-3 rounded w-40"> 
                <Typography variant="h2" component="h2" style={{ paddingBottom: '30px' }}>MakeYourTrip</Typography>
                <h2>Log In</h2>
                <form onSubmit={handleLoginSuccess}> 
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            id="email"
                            className="form-control rounded-0"
                            aria-required="true"
                            required={true}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            id="password"
                            className="form-control rounded-0"
                            aria-required="true"
                            required={true}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Log In</button>
                    <p>Don't Have an Account?</p>
                    <Link to='/signup' type="button" className="btn btn-default w-100 bg-light rounded-0 text-decoration-none">Register</Link>
                </form>
            </div>
        </div>
    )
}

export default Login;