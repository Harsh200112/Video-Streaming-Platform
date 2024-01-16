import React, { useState } from 'react';


export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name1, setName1] = useState('Login');
    const [name2, setName2] = useState('SignUp')

    const handleLogin = async (e) => {
        e.preventDefault();
        setName1('Login');
        setName2('SignUp');
        try {
          const response = await fetch('http://localhost:3050/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            console.log('Login successful:', data);
            alert("Logged In Successfully!!");
            onLoginSuccess(username);
          } else {
            console.error('Login failed:', data);
            alert("Invalid Username or Password");
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      };

    const handleChange = (event) => {
        const name = event.target.value;
        setUsername(name);
    }

    const handlesignup = (e)=>{
        e.preventDefault();
        setName1('SignUp');
        setName2('Login');
    }

    const handleChange2 = (event) =>{
        const pass = event.target.value;
        setPassword(pass);
    }

    return (
        <div className='flex flex-col justify-center items-center bg-slate-700 h-screen w-screen shadow-white'>
            <form className='w-2/6 h-3/6 flex flex-col bg-white rounded-3xl justify-center shadow-md shadow-white'>
                <text className='font-bold text-3xl text-center'>ViewVault</text>
                <div className='flex flex-col justify-center items-center'>
                    <text className='font-bold p-4 text-xl'>Username</text>
                    <input type='text' className='p-4 w-4/6 h-14 bg-slate-500 rounded-2xl text-white' value={username} onChange={handleChange} placeholder='UserName'></input>
                </div>
                <div className='flex flex-col justify-center items-center'>
                    <text className='font-bold text-xl p-4'>Password</text>
                    <input type='password' className='p-4 w-4/6 h-14 bg-slate-500 rounded-2xl text-white' value={password} onChange={handleChange2} placeholder='Password'></input>
                </div>
                <div className='flex flex-row justify-center'>
                <button className='relative bg-slate-700 w-20 mx-2 h-12 rounded-2xl my-5 text-white font-bold self-center' onClick={handleLogin}>{name1}</button>
                <button className='relative bg-slate-700 w-20 h-12 rounded-2xl my-5 text-white font-bold self-center' onClick={handlesignup}>{name2}</button>
                </div>
            </form>
        </div>
    );
}