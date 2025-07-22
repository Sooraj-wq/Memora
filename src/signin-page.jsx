import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SigninPage(){

    const navigate = useNavigate(); 
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpass, setConfirmpass] = useState('');

    const handleLogin = async()=>{

            if(password!=confirmpass){
                alert('Passwords do not match!')
                return;
            }

            try {
            const res = await fetch('http://localhost:3000/api/signup', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            const { token } = data;
            localStorage.setItem('token', token);

            navigate("/dashboard");
            }catch (err) {
                alert(err.message);
                }
            };

    //to go back to login page
    const handleClick = () => {
        window.location.href = 'http://localhost:5173/login';
    };

    return (<>
        <div className="bg-pink-600 w-screen h-21 text-2xl">
            <div className="relative bg-gray-900 w-full h-20 flex items-center text-pink-600 px-6">
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                    Memora
                    </div>
            </div>
        </div>
        <div className="title-text-container text-white w-screen text-2xl flex justify-center items-center mt-5">
            <div className="title-text-container text-white">Sign Up to use Memora.</div>
        </div>
        <div className="wrapper min-h-screen flex justify-center mt-10">
             <div className="form-container w-82 h-118 bg-pink-600 rounded-4xl flex justify-center items-center md:w-150  ">
                <div className="form-container w-80 h-116 bg-gray-900 rounded-4xl md:w-149 text-white flex flex-col items-center">
                    <p className="email-text text-white self-start ml-12 mt-10 md:ml-27 mb-2">Email:</p>
                    <input onChange={e=>setEmail(e.target.value)} className="email-field bg-black h-2 w-60 text-1xl md:h-10 md:w-100 rounded-4xl p-5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Enter E-mail"></input>
                    <p className="email-text text-white self-start ml-12 mt-5 md:ml-27 mb-2">Password:</p>
                    <input onChange={e=>setPassword(e.target.value)} className="email-field bg-black h-2 w-60 text-1xl md:h-10 md:w-100 rounded-4xl p-5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Enter password"></input>
                    <p className="email-text text-white self-start ml-12 mt-5 md:ml-27 mb-2">Confirm Password:</p>
                    <input onChange={e=>setConfirmpass(e.target.value)} className="email-field bg-black h-2 w-60 text-1xl md:h-10 md:w-100 rounded-4xl p-5 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500" placeholder="Confirm password"></input>
                    <button onClick={handleLogin} class="group hover:cursor-pointer group-hover:before:duration-500 group-hover:after:duration-500 after:duration-500 mt-16 hover:border-pink-600 hover:before:[box-shadow:_20px_20px_20px_30px_#a21caf] duration-500 before:duration-500 hover:duration-500 underline underline-offset-2 hover:after:-right-8 hover:before:right-12 hover:before:-bottom-8 hover:before:blur hover:underline hover:underline-offset-4  origin-left hover:decoration-2 hover:text-white relative bg-neutral-800 h-12 w-44 border text-left p-3 text-gray-50 text-base font-bold rounded-4xl overflow-hidden  before:absolute before:w-12 before:h-12 before:content[''] before:right-1 before:top-1 before:z-10 before:bg-pink-600 before:rounded-full before:blur-lg  after:absolute after:z-10 after:w-20 after:h-20 after:content['']  after:bg-pink-600 after:right-8 after:top-3 after:rounded-full after:blur-lg">
                    Sign Up!
                    </button>
                    <div onClick={handleClick} className="text-pink-600 self-center mt-4 hover:underline cursor-pointer text-[15px]">Back to Log In</div>
                </div>
             </div>
        </div>
        
</>)
}

export default SigninPage;