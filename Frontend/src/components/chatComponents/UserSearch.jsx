import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setChatLoading, setLoading, setUserSearchBox } from "../../redux/slices/conditionSlice";
import { toast } from "react-toastify";
import ChatShimmer from "../loading/ChatShimmer";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const UserSearch = () => {
    const dispatch = useDispatch();
    const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [inputUserName, setInputUserName] = useState("");
    const authUserId = useSelector((store) => store?.auth?._id);

    useEffect(() => {
        const getAllUsers = () => {
            dispatch(setChatLoading(true));
            const token = localStorage.getItem("token");
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    setUsers(json.data || []);
                    setSelectedUsers(json.data || []);
                    dispatch(setChatLoading(false));
                })
                .catch((err) => {
                    console.log(err);
                    dispatch(setChatLoading(false));
                });
        };
        getAllUsers();
    }, [dispatch]);

    useEffect(() => {
        setSelectedUsers(
            users.filter((user) => {
                return (
                    user.firstName.toLowerCase().includes(inputUserName.toLowerCase()) ||
                    user.lastName.toLowerCase().includes(inputUserName.toLowerCase()) ||
                    user.email.toLowerCase().includes(inputUserName.toLowerCase())
                );
            })
        );
    }, [inputUserName, users]);

    const handleCreateChat = async (userId) => {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId }),
        })
            .then((res) => res.json())
            .then((json) => {
                dispatch(addSelectedChat(json?.data));
                dispatch(setLoading(false));
                socket.emit("chat created", json?.data, authUserId);
                toast.success("Created & Selected chat");
                dispatch(setUserSearchBox());
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.message);
                dispatch(setLoading(false));
            });
    };

    return (
        <>
            <div className="p-4 w-full h-[7vh] font-semibold flex justify-between items-center bg-gray-900 text-gray-100 border-r border-gray-700">
                <h1 className="text-lg whitespace-nowrap">New Chat</h1>
                <div className="w-2/3 flex items-center gap-2">
                    <input
                        id="search"
                        type="text"
                        placeholder="Search Users..."
                        className="w-full border border-gray-600 py-1 px-2 rounded-md bg-transparent text-white outline-none placeholder-gray-400 focus:bg-gray-700"
                        onChange={(e) => setInputUserName(e.target.value)}
                    />
                    <label htmlFor="search" className="cursor-pointer text-gray-400 hover:text-white transition">
                        <FaSearch title="Search Users" />
                    </label>
                </div>
            </div>
            <div className="flex flex-col w-full px-3 gap-2 py-2 overflow-y-auto h-[73vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {selectedUsers.length === 0 && isChatLoading ? (
                    <ChatShimmer />
                ) : (
                    <>
                        {selectedUsers.length === 0 && (
                            <div className="w-full h-full flex justify-center items-center text-gray-400">
                                <h1 className="text-base font-medium">No users registered.</h1>
                            </div>
                        )}
                        {selectedUsers.map((user) => (
                            <div
                                key={user._id}
                                className="w-full h-16 border border-gray-600 rounded-lg flex items-center p-3 font-semibold gap-3 hover:bg-gray-700 transition cursor-pointer text-gray-100"
                                onClick={() => handleCreateChat(user._id)}
                            >
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={user.image}
                                    alt="User"
                                />
                                <div className="w-full">
                                    <span className="line-clamp-1 capitalize">{user.firstName} {user.lastName}</span>
                                    <div>
                                        <span className="text-xs font-light text-gray-300">
                                            {SimpleDateAndTime(user.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </>
    );
};

export default UserSearch;
