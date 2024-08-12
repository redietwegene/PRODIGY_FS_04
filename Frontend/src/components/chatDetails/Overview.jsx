import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getChatName, { getChatImage } from "../../utils/getChatName";
import { SimpleDateAndTime } from "../../utils/formateDateTime";
import { CiCircleInfo } from "react-icons/ci";
import { toast } from "react-toastify";
import { RxUpdate } from "react-icons/rx";
import { addSelectedChat } from "../../redux/slices/myChatSlice";
import { setLoading } from "../../redux/slices/conditionSlice";

const Overview = () => {
	const dispatch = useDispatch();
	const authUserId = useSelector((store) => store?.auth?._id);
	const selectedChat = useSelector((store) => store?.myChat?.selectedChat);
	const [changeNameBox, setChangeNameBox] = useState(false);
	const [changeName, setChangeName] = useState(selectedChat?.chatName || "");

	const handleShowNameChange = () => {
		if (authUserId === selectedChat?.groupAdmin?._id) {
			setChangeNameBox(!changeNameBox);
			setChangeName(selectedChat?.chatName || "");
		} else {
			toast.warn("You're not an admin");
		}
	};

	const handleChangeName = () => {
		if (!changeName.trim()) {
			toast.warn("Please enter a group name");
			return;
		}
		if (selectedChat?.chatName === changeName.trim()) {
			toast.warn("Name already taken");
			return;
		}

		setChangeNameBox(false);
		dispatch(setLoading(true));
		const token = localStorage.getItem("token");

		fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				name: changeName.trim(),
				chatId: selectedChat?._id,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				dispatch(addSelectedChat(json?.data));
				toast.success("Group name changed");
			})
			.catch((err) => {
				console.error(err);
				toast.error("Failed to change group name");
			})
			.finally(() => {
				dispatch(setLoading(false));
			});
	};

	return (
		<div className="flex flex-col gap-4 p-4 bg-gray-800 text-white">
			<div className="flex flex-col items-center gap-2">
				<img
					src={getChatImage(selectedChat, authUserId)}
					alt="Chat Avatar"
					className="h-16 w-16 rounded-full border border-gray-600"
				/>
				<div className="text-center text-lg font-semibold flex items-center gap-2">
					<h1>{getChatName(selectedChat, authUserId)}</h1>
					{selectedChat?.isGroupChat && (
						<CiCircleInfo
							fontSize={18}
							title="Change Name"
							className="cursor-pointer"
							onClick={handleShowNameChange}
						/>
					)}
				</div>
			</div>

			{changeNameBox && (
				<div className="flex flex-col gap-2">
					<h2 className="text-lg font-semibold">Rename Group Chat:</h2>
					<div className="flex gap-2">
						<input
							type="text"
							className="w-full border border-gray-600 py-1 px-2 rounded-md bg-gray-700 text-white"
							value={changeName}
							onChange={(e) => setChangeName(e.target.value)}
						/>
						<button
							title="Change Name"
							className="flex items-center justify-center border border-gray-600 p-2 rounded-md bg-gray-700 hover:bg-gray-600"
							onClick={handleChangeName}
						>
							<RxUpdate fontSize={18} />
						</button>
					</div>
				</div>
			)}

			<div className="w-full h-px bg-gray-600 my-4"></div>

			<div className="text-sm">
				<h3 className="font-semibold">Created</h3>
				<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.createdAt)}</p>
			</div>
			<div className="text-sm">
				<h3 className="font-semibold">Last Updated</h3>
				<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.updatedAt)}</p>
			</div>
			<div className="text-sm">
				<h3 className="font-semibold">Last Message</h3>
				<p className="text-gray-400">{SimpleDateAndTime(selectedChat?.latestMessage?.updatedAt)}</p>
			</div>
		</div>
	);
};

export default Overview;
