import React, { useState } from 'react';
import HomePage from './HomePage';
import Login from './Login';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLoginSuccess = (userid) => {
    setLoggedIn(true);
    setUsername(userid);
  };

  return (
    <>
      {isLoggedIn ? (
        <HomePage data = {username} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

export default App;