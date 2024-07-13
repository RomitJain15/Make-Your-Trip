import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate();

    const handleSignUpSuccess = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        axios.post('https://make-your-trip-backend.onrender.com/api/register', { name, email, password })
            .then(response => {
                localStorage.setItem('userName', response.data.user.name);
                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('token', response.data.token);
                navigate('/');
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    alert('User already exists.');
                } else {
                    alert('Sign Up Failed! Please try again.');
                }
            });
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
            <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
                <div className="bg-white p-3 rounded w-25">
                    <h2>Register</h2>
                    <form onSubmit={handleSignUpSuccess}> {/* Moved onSubmit here */}
                        <div className="mb-3">
                            <label htmlFor="name">
                                <strong>Name</strong>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Name"
                                autoComplete="off"
                                name="name"
                                id="name"
                                className="form-control rounded-0"
                                aria-required="true"
                                required={true}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                        <button type="submit" className="btn btn-success w-100 rounded-0">Register</button>
                        <p>Already Have an Account</p>
                        <Link to='/login' type="button" className="btn btn-default w-100 bg-light rounded-0 text-decoration-none">Login</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp;