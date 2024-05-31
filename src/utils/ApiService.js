import axios from 'axios';
const apiService = async (method, url, data = null, params = null) => {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    url,
    data,
    params,
    headers,
  };
  const result = await axios(config)
  .then(response => response.data)
  .catch(error => {
    console.error('API call error:', error);
    throw error;
  });
  
  return result;
};

export default apiService;
