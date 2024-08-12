import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatLoading, setGroupChatBox, setGroupChatId, setLoading } from "../../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import ChatShimmer from "../loading/ChatShimmer";
import { handleScrollEnd } from "../../utils/handleScrollTop";
import { toast } from "react-toastify";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import socket from "../../socket/socket";

const GroupChatBox = () => {
  const groupUser = useRef(null);
  const dispatch = useDispatch();
  const isChatLoading = useSelector((store) => store?.condition?.isChatLoading);
  const authUserId = useSelector((store) => store?.auth?._id);
  const [isGroupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [inputUserName, setInputUserName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isGroupUsers, setGroupUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        dispatch(setChatLoading(true));
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data.data || []);
        setSelectedUsers(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        dispatch(setChatLoading(false));
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    setSelectedUsers(
      users.filter((user) => {
        const query = inputUserName.toLowerCase();
        return (
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
        );
      })
    );
  }, [inputUserName, users]);

  useEffect(() => {
    handleScrollEnd(groupUser.current);
  }, [isGroupUsers]);

  const addGroupUser = (user) => {
    if (!isGroupUsers.some((currUser) => currUser._id === user._id)) {
      setGroupUsers([...isGroupUsers, user]);
    } else {
      toast.warn(`"${user.firstName}" already Added`);
    }
  };

  const handleRemoveGroupUser = (removeUserId) => {
    setGroupUsers(isGroupUsers.filter((user) => user._id !== removeUserId));
  };

  const handleCreateGroupChat = async () => {
    if (isGroupUsers.length < 2) {
      toast.warn("Please select at least 2 users");
      return;
    }
    if (!isGroupName.trim()) {
      toast.warn("Please enter group name");
      return;
    }
    try {
      dispatch(setGroupChatBox());
      dispatch(setLoading(true));
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/group`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: isGroupName.trim(),
          users: isGroupUsers,
        }),
      });
      const json = await response.json();
      dispatch(addSelectedChat(json.data));
      dispatch(setGroupChatId(json.data._id));
      socket.emit("chat created", json.data, authUserId);
      toast.success("Created & Selected chat");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-6 min-h-screen w-full fixed top-0 z-50 bg-black bg-opacity-50">
      <div className="p-5 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] max-w-[1000px] border border-gray-700 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl underline underline-offset-8 font-semibold text-white text-center mb-4">
          Create a Group
        </h2>
        <div className="w-full py-4 flex flex-wrap items-center gap-4">
          <div className="w-full flex items-center gap-2">
            <input
              value={inputUserName}
              id="search"
              type="text"
              placeholder="Search Users..."
              className="w-2/3 border border-gray-600 py-2 px-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setInputUserName(e.target.value)}
            />
            <FaSearch title="Search Users" className="text-white cursor-pointer" />
          </div>
          <div ref={groupUser} className="flex w-full gap-2 py-2 overflow-x-auto scrollbar-hide">
            {isGroupUsers.length > 0 &&
              isGroupUsers.map((user) => (
                <div key={user._id} className="flex items-center gap-2 border border-gray-600 py-2 px-3 rounded-md bg-gray-700 text-white">
                  <h1>{user.firstName}</h1>
                  <div
                    title={`Remove ${user.firstName}`}
                    onClick={() => handleRemoveGroupUser(user._id)}
                    className="bg-red-600 hover:bg-red-800 h-6 w-6 rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <MdOutlineClose size={18} className="text-white" />
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-col w-full h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {selectedUsers.length === 0 && isChatLoading ? (
              <ChatShimmer />
            ) : (
              <>
                {selectedUsers.length === 0 && (
                  <div className="w-full h-full flex justify-center items-center text-white">
                    <h1 className="text-base font-semibold">No users registered.</h1>
                  </div>
                )}
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="w-full h-16 border border-gray-600 rounded-lg flex items-center p-2 gap-3 hover:bg-gray-700 cursor-pointer text-white"
                    onClick={() => {
                      addGroupUser(user);
                      setInputUserName("");
                    }}
                  >
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={user.image}
                      alt="user"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold capitalize">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs font-light text-gray-400">
                        {SimpleDateAndTime(user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            placeholder="Group Name"
            className="w-2/3 border border-gray-600 py-2 px-3 rounded-md bg-gray-700 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="border border-gray-600 py-2 px-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-green-700"
            onClick={handleCreateGroupChat}
          >
            Create
          </button>
        </div>
        <div
          title="Close"
          onClick={() => dispatch(setGroupChatBox())}
          className="bg-red-600 hover:bg-red-800 h-7 w-7 rounded-md flex items-center justify-center absolute top-3 right-3 cursor-pointer"
        >
          <MdOutlineClose size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default GroupChatBox;
