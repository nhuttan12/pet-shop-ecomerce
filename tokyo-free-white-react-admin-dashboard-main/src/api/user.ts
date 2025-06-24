import axios from 'axios';

const host = 'http://localhost:8080';

export const getAllUsers = async () => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('⚠️ No token found in localStorage!');
    return [];
  }

  const response = await axios.get(host + '/api/v1/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });


  console.log(response.data);

  return response.data.data; // giả sử API trả về { data: [...] }
};
