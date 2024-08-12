import React, { useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
	setChatDetailsBox,
	setLoading,
} from "../../redux/slices/conditionSlice";
import { addAllMessages } from "../../redux/slices/messageSlice";
import { deleteSelectedChat } from "../../redux/slices/myChatSlice";
import socket from "../../socket/socket";

const ChatSetting = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [isConfirm, setConfirm] = useState("");

	const handleClearChat = () => {
		if (
			authUserId === selectedChat?.groupAdmin?._id ||
			!selectedChat?.isGroupChat
		) {
			setConfirm("clear-chat");
		} else {
			toast.warn("You're not admin");
		}
	};

	const handleDeleteGroup = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			setConfirm("delete-group");
		} else {
			toast.warn("You're not admin");
		}
	};

	const handleDeleteChat = () => {
		if (!selectedChat?.isGroupChat) {
			setConfirm("delete-chat");
		}
	};

	const handleClearChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/message/clearChat/${
				selectedChat?._id
			}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((json) => {
				setConfirm("");
				dispatch(setLoading(false));
				if (json?.message === "success") {
					dispatch(addAllMessages([]));
					socket.emit("clear chat", selectedChat._id);
					toast.success("Cleared all messages");
				} else {
					toast.error("Failed to clear chat");
				}
			})
			.catch((err) => {
				console.log(err);
				setConfirm("");
				dispatch(setLoading(false));
				toast.error("Failed to clear chat");
			});
	};

	const handleDeleteChatCall = () => {
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");
		fetch(
			`${import.meta.env.VITE_BACKEND_URL}/api/chat/deleteGroup/${
				selectedChat?._id
			}`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((res) => res.json())
			.then((json) => {
				dispatch(setLoading(false));
				if (json?.message === "success") {
					let chat = selectedChat;
					dispatch(setChatDetailsBox(false));
					dispatch(addAllMessages([]));
					dispatch(deleteSelectedChat(chat._id));
					socket.emit("delete chat", chat, authUserId);

					toast.success("Chat deleted successfully");
				} else {
					toast.error("Failed to delete chat");
				}
			})
			.catch((err) => {
				console.log(err);
				dispatch(setLoading(false));
				toast.error("Failed to delete chat");
			});
	};

	return (
		<div className="flex flex-col p-4 gap-4 text-white bg-gray-800 border-t border-gray-700 relative h-full overflow-auto">
			<h1 className="text-xl font-semibold text-center mb-4">Settings</h1>
			<div
				onClick={handleClearChat}
				className="w-full h-12 border border-gray-600 text-sm rounded-lg flex justify-between items-center p-3 font-medium gap-3 transition-all cursor-pointer hover:bg-gray-700"
			>
				<h1>Clear Chat</h1>
				<CiCircleInfo
					fontSize={18}
					title={
						selectedChat?.isGroupChat
							? "Admin access only"
							: "Clear Chat"
					}
					className="text-gray-400"
				/>
			</div>
			{selectedChat?.isGroupChat ? (
				<div
					onClick={handleDeleteGroup}
					className="w-full h-12 border border-gray-600 text-sm rounded-lg flex justify-between items-center p-3 font-medium gap-3 transition-all cursor-pointer hover:bg-gray-700"
				>
					<h1>Delete Group</h1>
					<CiCircleInfo
						fontSize={18}
						title="Admin access only"
						className="text-gray-400"
					/>
				</div>
			) : (
				<div
					onClick={handleDeleteChat}
					className="w-full h-12 border border-gray-600 text-sm rounded-lg flex justify-between items-center p-3 font-medium gap-3 transition-all cursor-pointer hover:bg-gray-700"
				>
					<h1>Delete Chat</h1>
					<CiCircleInfo
						fontSize={18}
						title="Delete Chat"
						className="text-gray-400"
					/>
				</div>
			)}
			{isConfirm && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
					<div
						className={`w-full h-14 border border-gray-600 ${
							isConfirm === "clear-chat"
								? "bg-blue-900"
								: "bg-red-900"
						} rounded-lg flex justify-between items-center p-4 font-medium gap-3 text-white`}
					>
						<h1>
							{isConfirm === "clear-chat"
								? "Clear chat confirmation?"
								: isConfirm === "delete-group"
								? "Delete group confirmation?"
								: "Delete chat confirmation"}
						</h1>
						<div className="flex gap-2">
							<div
								onClick={() => setConfirm("")}
								className="border border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-700"
							>
								<VscError fontSize={20} />
							</div>
							<div
								onClick={
									isConfirm === "clear-chat"
										? handleClearChatCall
										: handleDeleteChatCall
								}
								className="border border-gray-600 p-2 rounded-md cursor-pointer hover:bg-gray-700"
							>
								<IoCheckmarkCircleOutline fontSize={20} />
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatSetting;
