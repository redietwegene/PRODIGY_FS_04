import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'

const SignUp = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [load, setLoad] = useState("");
    const [isShow, setIsShow] = useState(false);
    const navigate = useNavigate();

    const signUpUser = (e) => {
        // Signup ---
        toast.loading("Wait until you SignUp");
        e.target.disabled = true;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
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
                    navigate("/signin");
                    toast.success(json?.message);
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

    const handleSignup = (e) => {
        if (firstName && lastName && email && password) {
            const validError = checkValidSignUpFrom(
                firstName,
                lastName,
                email,
                password
            );
            if (validError) {
                toast.error(validError);
                return;
            }
            setLoad("Loading...");
            signUpUser(e);
        } else {
            toast.error("Required: All Fields");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <div className="w-full max-w-md p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                    SignUp ChatApp
                </h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">First Name</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600"
                            type="text"
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Last Name</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600"
                            type="text"
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                        <input
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600"
                            type="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
                        <div className="relative">
                            <input
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-600"
                                type={isShow ? "text" : "password"}
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                onClick={() => setIsShow(!isShow)}
                            >
                                {isShow ? < MdVisibility/> : <MdVisibilityOff  />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSignup(e);
                            }}
                            className="w-full py-2 bg-green-800 text-white rounded-lg hover:bg-green-700"
                            disabled={load !== ""}
                        >
                            {load === "" ? "Sign Up" : load}
                        </button>
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-gray-600">Already have an account?</p>
                        <Link to="/signin" className="text-green-800 font-semibold hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
