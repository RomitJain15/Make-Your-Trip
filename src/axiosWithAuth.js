import axios from 'axios';

const axiosWithAuth = () => {
  const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

  return axios.create({
    baseURL: 'http://localhost:5000', // Set the common URL for all requests
    headers: {
      Authorization: `Bearer ${token}` // Set the Authorization header with the JWT token
    }
  });
};

export default axiosWithAuth;