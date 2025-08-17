import API from '../api/axios';

export const registerUser = async (userData) => {
  const response = await API.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post('/auth/login', userData, {
    withCredentials: true,
  });
  
  // token localStorage me save
  localStorage.setItem("token", response.data.token);

  return response.data; // { token, user }
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout', {}, {
    withCredentials: true,
  });
  
  localStorage.removeItem("token"); // logout par token remove
  return response.data;
};

export const getProfile = async () => {
  const response = await API.get('/auth/profile', {
    withCredentials: true,
  });
  return response.data;
};
