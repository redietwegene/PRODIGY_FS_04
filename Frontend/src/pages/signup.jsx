
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import axios from "axios"
const SignUp = () => {
    const navigateTo = useNavigate();

    const [name, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("pic",pic)
        formData.append("name",name)
        formData.append("email",email)
        formData.append("password",password)
        try {
          const response = await axios.post("http://localhost:3000/signup",formData);
          if(response.status==200){
          setUsername('');
          setEmail('');
          setPassword('');
          setPic(null)
          navigateTo("/");
          }
         
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-400">
            <div className="w-full max-w-sm p-8 bg-white rounded shadow-lg">
                <h2 className="mb-6 text-2xl font-semibold text-center text-gray-700">SignUp</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-600 font-medium text-sm block mb-3">Username</label>
                        <input 
                            type="text"
                            className="border w-full p-2 mb-3 rounded-lg focus:outline-none focus:border-lime-600"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="text-gray-600 font-medium text-sm block mb-3">Email</label>
                        <input 
                            type="text"
                            name="email"
                            className="border w-full p-2 mb-3 rounded-lg focus:outline-none focus:border-lime-600"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div className="mb-6">
                            <label className="block mb-3 text-sm font-medium text-gray-600">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="w-full py-2 pl-2 pr-10 border rounded-lg focus:outline-none focus:border-lime-600"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                               
                                <button
                                    type="button"
                                    className="absolute top-1/4 transform -translate-y-5 right-3 text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                                </button>
                                 <div>
                     <label htmlFor="pic" className = "block mb-3 text-sm font-medium text-gray-600">Picture </label>
                         <input type="file" onChange={(e) => setPic(e.target.files[0])} name="pic" id="pic" accept="image/*" />
                       
                    </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <button type="submit" className="flex justify-center w-64 py-2 mb-3 text-white bg-green-800 rounded-lg hover:bg-green-700">Sign up</button>
                    </div>
                   
                    
                    
                </form>
                <div className="flex justify-center">
                    <p>Already have an account?</p>
                    <h5 className="text-green-800 font-medium">
                        <Link to="/login">Login</Link>
                    </h5>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
