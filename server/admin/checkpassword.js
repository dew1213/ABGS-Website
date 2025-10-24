const config = require('../config.json');
const axios = require('axios');

async function checkVerifyPassword(email, password) {
  
  const apiKey = config.WebAPIkey;
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
console.log("api "+apiKey)
console.log("url "+url)
  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    },{ timeout: 5000 });

   
    return true
  } catch (error) {
    
    const errorMessage = error.response?.data?.error?.message || error.message;

    console.error('Firebase login failed:', errorMessage);
    return false;
  }
}

module.exports = checkVerifyPassword;
