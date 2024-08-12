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
    <div className="flex -m-2 sm:-m-4 flex-col items-center my-6 text-slate-300 min-h-screen w-full fixed top-0 justify-center z-50">
      <div className="p-3 pt-4 w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] min-w-72 max-w-[1000px] border border-slate-400 bg-slate-800 rounded-lg h-fit mt-5 transition-all relative">
        <h2 className="text-2xl underline underline-offset-8 font-semibold text-slate-100 w-full text-center mb-2">
          Create a Group
        </h2>
        <div className="w-full py-4 justify-evenly flex flex-wrap items-center gap-3">
          <div className="w-full flex flex-nowrap items-center justify-center gap-2">
            <input
              value={inputUserName}
              id="search"
              type="text"
              placeholder="Search Users..."
              className="w-2/3 border border-slate-600 py-1 px-2 font-normal outline-none rounded-md cursor-pointer bg-transparent active:bg-black/20"
              onChange={(e) => setInputUserName(e.target.value)}
            />
            <label htmlFor="search" className="cursor-pointer">
              <FaSearch title="Search Users" />
            </label>
          </div>
          <div ref={groupUser} className="flex w-full px-4 gap-1 py-2 overflow-auto scroll-style-x">
            {isGroupUsers.length > 0 &&
              isGroupUsers.map((user) => (
                <div key={user._id} className="flex justify-center items-center gap-1 border border-slate-600 py-1 px-2 font-normal rounded-md cursor-pointer bg-transparent active:bg-black/20 text-nowrap">
                  <h1>{user.firstName}</h1>
                  <div title={`Remove ${user.firstName}`} onClick={() => handleRemoveGroupUser(user._id)} className="bg-black/15 hover:bg-black/50 h-6 w-6 m-0.5 rounded-md flex items-center justify-center cursor-pointer">
                    <MdOutlineClose size={18} />
                  </div>
                </div>
              ))}
          </div>
          <div className="flex flex-col w-full px-4 gap-1 py-2 overflow-y-auto overflow-hidden scroll-style h-[50vh]">
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
                  <div key={user._id} className="w-full h-16 border-slate-500 border rounded-lg flex justify-start items-center p-2 font-semibold gap-2 hover:bg-black/50 transition-all cursor-pointer text-white" onClick={() => {
                    addGroupUser(user);
                    setInputUserName("");
                  }}>
                    <img className="h-12 min-w-12 rounded-full" src={user.image} alt="user" />
                    <div className="w-full">
                      <span className="line-clamp-1 capitalize">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs font-light">
                        {SimpleDateAndTime(user.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="w-full flex flex-nowrap items-center justify-center gap-2">
          <input
            type="text"
            placeholder="Group Name"
            className="w-2/3 border border-slate-600 py-1 px-2 font-normal outline-none rounded-md cursor-pointer bg-transparent active:bg-black/20"
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button
            className="border border-slate-600 py-1 px-2 rounded-lg bg-green-400 text-black font-semibold hover:text-white hover:bg-green-700"
            onClick={handleCreateGroupChat}
          >
            Create
          </button>
        </div>
        <div title="Close" onClick={() => dispatch(setGroupChatBox())} className="bg-black/15 hover:bg-black/50 h-7 w-7 rounded-md flex items-center justify-center absolute top-3 right-3 cursor-pointer">
          <MdOutlineClose size={22} />
        </div>
      </div>
    </div>
  );
};

export default GroupChatBox;
