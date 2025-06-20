import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'token';

export const setAuthToken = (token) => {
  Cookies.set(AUTH_TOKEN_KEY, token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' 
  });
};

export const getAuthToken = () => {
    const token = Cookies.get(AUTH_TOKEN_KEY);
    console.log("Getting auth token",token);
  return token;
};

export const removeAuthToken = () => {
  Cookies.remove(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
