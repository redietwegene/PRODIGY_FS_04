import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.auth);

    const handleUpdate = () => {
        toast.warn("Coming soon");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="p-6 sm:p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] bg-gray-800 border border-gray-600 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-semibold text-gray-100 text-center mb-4">
                    Profile
                </h2>
                <div className="flex flex-col items-center sm:flex-row gap-6 sm:gap-8">
                    <img
                        src={user.image}
                        alt="User"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-gray-600"
                    />
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">
                            Name: {user.firstName} {user.lastName}
                        </h3>
                        <h3 className="text-xl font-semibold text-gray-200 mb-4">
                            Email: {user.email}
                        </h3>
                        <div className="flex gap-4">
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    title="Close"
                    onClick={() => dispatch(setProfileDetail())}
                    className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-100 p-2 rounded-full cursor-pointer transition"
                >
                    <MdOutlineClose size={24} />
                </div>
            </div>
        </div>
    );
};

export default ProfileDetail;
