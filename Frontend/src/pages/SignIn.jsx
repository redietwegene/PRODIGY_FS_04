import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState("");
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logInUser = (e) => {
        // SignIn ---
        toast.loading("Wait until you SignIn");
        e.target.disabled = true;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                setLoad("");
                e.target.disabled = false;
                toast.dismiss();
                if (json.token) {
                    localStorage.setItem("token", json.token);
                    dispatch(addAuth(json.data));
                    navigate("/");
                } else {
                    toast.error(json?.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoad("");
                toast.dismiss();
                toast.error("Error : " + error.code);
                e.target.disabled = false;
            });
    };

    const handleLogin = (e) => {
        if (email && password) {
            const validError = checkValidSignInFrom(email, password);
            if (validError) {
                toast.error(validError);
                return;
            }
            setLoad("Loading...");
            logInUser(e);
        } else {
            toast.error("Required: All Fields");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">
                    SignIn ChatApp
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            type="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                        <input
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                            type={isShow ? "text" : "password"}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-3/4 transform -translate-y-3/4 text-gray-500"
                            onClick={() => setIsShow(!isShow)}
                        >
                            {isShow ? <MdVisibility /> : <MdVisibilityOff />}
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogin(e);
                            }}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            disabled={load !== ""}
                        >
                            {load === "" ? "Sign In" : load}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <Link to="/forgetpassword" className="text-blue-400 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-400">Don't have an account?</p>
                        <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
