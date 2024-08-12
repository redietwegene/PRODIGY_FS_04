import React, { useEffect, useRef, useState } from "react";
import { FaFolderOpen, FaPaperPlane } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setSendLoading, setTyping } from "../../redux/slices/conditionSlice";
import { addNewMessage, addNewMessageId } from "../../redux/slices/messageSlice";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import socket from "../../socket/socket";

let lastTypingTime;

const MessageSend = ({ chatId }) => {
	const mediaFile = useRef();
	const [newMessage, setMessage] = useState("");
	const dispatch = useDispatch();
	const isSendLoading = useSelector((store) => store?.condition?.isSendLoading);
	const isSocketConnected = useSelector((store) => store?.condition?.isSocketConnected);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const isTyping = useSelector((store) => store?.condition?.isTyping);

	useEffect(() => {
		socket.on("typing", () => dispatch(setTyping(true)));
		socket.on("stop typing", () => dispatch(setTyping(false)));
		return () => {
			socket.off("typing");
			socket.off("stop typing");
		};
	}, [dispatch]);

	const handleMediaBox = () => {
		if (mediaFile.current?.files[0]) {
			toast.warn("Coming soon...");
		}
	};

	const handleSendMessage = async () => {
		if (newMessage?.trim()) {
			const message = newMessage?.trim();
			setMessage("");
			socket.emit("stop typing", selectedChat._id);
			dispatch(setSendLoading(true));
			const token = localStorage.getItem("token");
			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/message`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						message: message,
						chatId: chatId,
					}),
				});
				const data = await response.json();
				dispatch(addNewMessageId(data?.data?._id));
				dispatch(addNewMessage(data?.data));
				socket.emit("new message", data.data);
			} catch (error) {
				console.error("Error sending message:", error);
				toast.error("Message Sending Failed");
			} finally {
				dispatch(setSendLoading(false));
			}
		}
	};

	const handleTyping = (e) => {
		setMessage(e.target?.value);
		if (!isSocketConnected) return;
		if (!isTyping) {
			socket.emit("typing", selectedChat._id);
		}
		lastTypingTime = new Date().getTime();
		clearTimeout(window.typingTimeout);
		window.typingTimeout = setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDiff = timeNow - lastTypingTime;
			if (timeDiff > 3000) {
				socket.emit("stop typing", selectedChat._id);
			}
		}, 3000);
	};

	return (
		<>
			<form
				className="w-full flex items-center gap-1 h-[7vh] p-3 bg-slate-800 text-white"
				onSubmit={(e) => e.preventDefault()}
			>
				<label htmlFor="media" className="cursor-pointer">
					<FaFolderOpen
						title="Open File"
						size={22}
						className="active:scale-75 hover:text-green-400"
					/>
				</label>
				<input
					ref={mediaFile}
					type="file"
					name="image"
					accept="image/png, image/jpg, image/gif, image/jpeg"
					id="media"
					className="hidden"
					onChange={handleMediaBox}
				/>
				<input
					type="text"
					className="outline-none p-2 w-full bg-transparent"
					placeholder="Type a message"
					value={newMessage}
					onChange={handleTyping}
					aria-label="Type a message"
				/>
				<span className="flex justify-center items-center">
					{newMessage?.trim() && !isSendLoading && (
						<button
							className="outline-none p-2 border-slate-500 border-l"
							onClick={handleSendMessage}
							aria-label="Send message"
						>
							<FaPaperPlane
								title="Send"
								size={18}
								className="active:scale-75 hover:text-green-400"
							/>
						</button>
					)}
					{isSendLoading && (
						<button
							className="outline-none p-2 border-slate-500 border-l"
							aria-label="Sending message"
						>
							<LuLoader
								title="Loading..."
								fontSize={18}
								className="animate-spin"
							/>
						</button>
					)}
				</span>
			</form>
		</>
	);
};

export default MessageSend;
