import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineClose } from "react-icons/md";
import { setProfileDetail,  } from "../redux/slices/conditionSlice";


const ProfileDetail = () => {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.auth);
    const isUpdateProfileModalOpen = useSelector((store) => store.condition.isUpdateProfileModal);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
            <div className="p-6 sm:p-8 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] border border-blue-700 rounded-lg shadow-lg relative bg-black">
                <h2 className="text-2xl font-semibold text-blue-400 text-center mb-4">
                    Profile
                </h2>
                <div className="flex flex-col items-center sm:flex-row gap-6 sm:gap-8">
                    <img
                        src={user.image}
                        alt="User"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-blue-700"
                    />
                    <div className="flex flex-col items-center sm:items-start">
                        <h3 className="text-xl font-semibold text-blue-400 mb-2">
                            Name: {user.firstName} {user.lastName}
                        </h3>
                        <h3 className="text-xl font-semibold text-blue-300 mb-4">
                            Email: {user.email}
                        </h3>
                        <div className="flex gap-4">
                            <button
                               
                                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Update
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    title="Close"
                    onClick={() => dispatch(setProfileDetail())}
                    className="absolute top-3 right-3 bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer transition"
                >
                    <MdOutlineClose size={24} />
                </div>
            </div>
            {isUpdateProfileModalOpen && <UpdateProfileModal onClose={() => dispatch(setUpdateProfileModal(false))} />}
        </div>
    );
};

export default ProfileDetail;
